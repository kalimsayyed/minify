#!/bin/bash

cd  /home/kalim/git/minify/

for file in `find /home/kalim/git/minify/ -name "*.js"`
do
echo "Compressing $file …"
java -jar /home/kalim/min.jar --type js -o "${file%%.*}-min.js" "$file"
done

for file in `find /home/kalim/git/minify/ -name "*.css"`
do
echo "Compressing $file …"
java -jar /home/kalim/min.jar --type css -o "${file%%.*}-min.css" "$file"
done

`find /home/kalim/git/minify/*  -type f -name "*-min.css"  -print0 | xargs -0 sudo chmod 755`
`find /home/kalim/git/minify/*  -type f -name "*-min.js"  -print0 | xargs -0 sudo chmod 755`

exit 0
