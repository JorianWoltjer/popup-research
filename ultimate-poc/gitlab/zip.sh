#!/bin/bash
set -e
# Create a ZIP file to share the proof of concept

cwd=$(pwd)
tmp=$(mktemp -d)

rm -f poc.zip
mkdir $tmp/poc
cp -r static templates main.py requirements.txt $tmp/poc
cd $tmp
rm poc/static/saved-target/README.md

zip -r $cwd/poc.zip poc
cd $cwd
rm -rf $tmp

echo "Created poc.zip"
