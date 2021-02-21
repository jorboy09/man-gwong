#!/bin/bash


node ./stephenlihkg.js
if [ $? -eq 0 ]
then
    echo "Hello World"
    # run successfully
else
    echo "Hello World"
    # failed
fi
