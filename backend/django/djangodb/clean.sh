
for folder in uploads/*; do
    for file in $folder/*; do
        rm -rf $file
    done
done

