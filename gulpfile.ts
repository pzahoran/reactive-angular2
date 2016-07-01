import * as _ from 'lodash';
import * as gulp from "gulp";
import * as del from "del";
import * as browserify from "browserify";
import * as source from "vinyl-source-stream";
import * as gutil from 'gulp-util';
import { exec } from 'child_process';
import * as uglify from 'gulp-uglify';
import * as sourcemaps from 'gulp-sourcemaps';
import * as buffer from 'vinyl-buffer';
import * as seq from 'run-sequence';
import * as resolve from 'resolve';

const tsify = require("tsify");
const watchify = require("watchify");

const paths = {
    static: [
        'src/**/*.html', 
        'src/**/*.css',
        'node_modules/bootstrap/dist/**',
    ],
    ts: ['src/typings.d.ts', 'src/main.ts'],
    tsconfig: 'src/tsconfig.json',
    dest: 'dist',
    app: 'app.js',
    vendor: 'vendor.js',
    polyfill: 'polyfill.js',
    tspolyfill: ['src/polyfill.ts'],
    vendorpackages: _.keys(require('./package.json').dependencies)
};

const tsoptions = require('./' + paths.tsconfig);
function builderjs(src: string[], dest: string, fWatch:boolean, fMinify: boolean, externals: string[], requires: string[]) {
    var bundler = browserify({
            basedir: '.',
            debug: true,
            entries: src,
            cache: {},
            packageCache: {}
        })
        .plugin(tsify, tsoptions.compilerOptions)
        .external(externals);
    bundler = requires.reduce((b, id) => bundler.require(resolve.sync(id), {expose: id}), bundler);

    function rebundle() {
        return bundler
            .bundle()
            .on('error', function(er:any)  
            {
                console.log(er.message);
                this.emit('end');
            })
            .pipe(source(dest))
            .pipe(gulp.dest(paths.dest));
    }

    if (fWatch) {
        bundler = watchify(bundler);
        bundler.on("update", rebundle);
        bundler.on("log", gutil.log);
        gulp.watch('src/**/*.json', [])
            .on("change", rebundle);
    }

    return rebundle();
}
const buildapp = (fWatch: boolean) => builderjs(paths.ts, paths.app, fWatch, true, paths.vendorpackages, []);
const buildvendor = (fWatch: boolean) => builderjs(paths.ts, paths.vendor, fWatch, false, [], paths.vendorpackages);
const buildpollyfill = (fWatch: boolean) => builderjs(paths.tspolyfill, paths.polyfill, fWatch, false, [], []);

gulp.task("clean", () => del(paths.dest + '/**/*'));

gulp.task("static", () => gulp
    .src(paths.static)
    .pipe(gulp.dest(paths.dest))
);
gulp.task("js-app", () => buildapp(false));
gulp.task("js-vendor", () => buildvendor(false));
gulp.task('js-polyfill', () => buildpollyfill(false));
gulp.task("js", ['js-polyfill', 'js-app', 'js-vendor']);

gulp.task("build", (done: gulp.TaskCallback) => seq('clean', ['static', 'js'], done));

gulp.task('lite-server', () => exec('npm run lite'))
gulp.task("watch-static", ["static"], () => gulp.watch(paths.static, ["static"]));
gulp.task("watch-js", () => buildapp(true));
gulp.task("watch", (done: gulp.TaskCallback) => seq('clean', ['js-polyfill', 'js-vendor', 'watch-static', 'watch-js'], 'lite-server', done));

gulp.task("default", ["watch"]);