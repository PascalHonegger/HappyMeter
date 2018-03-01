$TARGETDIR = 'node_modules/angular2-emoji-picker/lib-dist'
if (Test-Path -Path $TARGETDIR){
	echo "Deleting all .ts files from $TARGETDIR"
	get-childitem $TARGETDIR -include *.ts -exclude *.d.ts -recurse | foreach ($_) {remove-item $_.fullname}
} else {
	echo 'Folder not found'
}