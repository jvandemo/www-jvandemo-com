As a big fan of the Apple full size keyboard, I was constantly bugged by the fact that the `home` and `end` keys were not working properly in many apps.

This fix, inspired by [this article](http://mwholt.blogspot.be/2012/09/fix-home-and-end-keys-on-mac-os-x.html), enables the keys to work properly everywhere:

Open a terminal:

```bash
$ cd ~/Library
$ mkdir KeyBindings
$ cd KeyBindings
$ vi DefaultKeyBinding.dict
```
    
Copy/paste the following lines:

```bash
{
  /* Remap Home / End keys to be correct */
  "\UF729" = "moveToBeginningOfLine:"; /* Home */
  "\UF72B" = "moveToEndOfLine:"; /* End */
  "$\UF729" = "moveToBeginningOfLineAndModifySelection:"; /* Shift + Home */
  "$\UF72B" = "moveToEndOfLineAndModifySelection:"; /* Shift + End */
  "^\UF729" = "moveToBeginningOfDocument:"; /* Ctrl + Home */
  "^\UF72B" = "moveToEndOfDocument:"; /* Ctrl + End */
  "$^\UF729" = "moveToBeginningOfDocumentAndModifySelection:"; /* Shift + Ctrl + Home */
  "$^\UF72B" = "moveToEndOfDocumentAndModifySelection:"; /* Shift + Ctrl + End */
}
```
    
Save the file and restart your computer.

Enjoy your `home` and `end` keys!
