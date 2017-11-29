$TARGETDIR = 'node_modules/angular2-emoji-picker/lib-dist'
if (Test-Path -Path $TARGETDIR){
	cd $TARGETDIR
	remove-item * -recurse -include *.ts -exclude *.d.ts
	cd '../../..'
} else {
	echo 'Folder not found'
}