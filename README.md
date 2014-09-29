# How to Download:

	wget -m -e robots=off --no-parent http://www.ceaam.net/sjc/legislacao/leis/

# Convert the files to utf-8:

	for file in *; do
	    iconv -f WINDOWS-1252 -t utf-8 "$file" -o "${file%.html}.html"
	done

	rm *.htm

# Convert to md:

	htmlmd -o ./markdown *.html
	


# include JQUERY in runtime to tests:

	var sc=document.createElement('script');
	sc.src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js";
	document.getElementsByTagName('head')[0].appendChild(sc);

	var sc=document.createElement('script');
	sc.src="https://rawgit.com/neocotic/html.md/master/dist/md.min.js";
	document.getElementsByTagName('head')[0].appendChild(sc);
