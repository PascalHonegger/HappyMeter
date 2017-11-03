del /S /F /Q ..\backend\client\assets
del /F /Q ..\backend\client\*.css
del /F /Q ..\backend\client\*.eot
del /F /Q ..\backend\client\*.html
del /F /Q ..\backend\client\*.jpg
del /F /Q ..\backend\client\*.js
del /F /Q ..\backend\client\*.map
del /F /Q ..\backend\client\*.svg
del /F /Q ..\backend\client\*.ttf
del /F /Q ..\backend\client\*.txt
del /F /Q ..\backend\client\*.woff
del /F /Q ..\backend\client\*.woff2

npm run build:aot:prod
