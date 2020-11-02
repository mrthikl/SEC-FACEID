const { watch, src, dest, parallel, series } = require("gulp");
const sass = require("gulp-dart-sass");
const babel = require("gulp-babel");
const autoprefixer = require("gulp-autoprefixer");
const imagemin = require("gulp-imagemin");
const sourcemaps = require("gulp-sourcemaps");
const nunjucks = require("gulp-nunjucks");
const sync = require("browser-sync").create();
const formatHtml = require("gulp-format-html");

const css = () =>
  src("src/index.scss")
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: "expanded" }))
    .pipe(autoprefixer({ grid: "autoplace" }))
    .pipe(sourcemaps.write("."))
    .pipe(dest("public/css"))
    .pipe(sync.stream());

const js = () =>
  src("src/index.js")
    .pipe(sourcemaps.init())
    .pipe(babel({ presets: ["@babel/preset-env"] }))
    .pipe(sourcemaps.write("."))
    .pipe(dest("public/js"))
    .pipe(sync.stream());

const img = () =>
  src("src/img/**/*")
    .pipe(imagemin())
    .pipe(dest("public/img"))
    .pipe(sync.stream());

const html = () =>
  src("src/*.html")
    .pipe(nunjucks.compile())
    .pipe(formatHtml({ end_with_newline: true }))
    .pipe(dest("public"));

const build = parallel(img, html, js, css);

const watching = () => {
  sync.init({ server: { baseDir: "public" }, notify: false });

  watch("src/img/**/*", img);
  watch("src/**/*.js", js);
  watch("src/**/*.scss", css);
  watch("src/**/*.html", html).on("change", sync.reload);
};

exports.build = build;
exports.default = series(build, watching);
