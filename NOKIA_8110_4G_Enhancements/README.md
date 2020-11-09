# Nokia 8110 4G enhancements
## 1) Anti-bounce Keyboard patching
Source : https://sites.google.com/view/bananahackers/customizations/fix-the-keypad-speed
**All changes will be restored after a factory reset or after an update !**

1. Get a copy of the keyboard application's folder from the system :

`adb pull /system/b2g/webapps/keyboard.gaiamobile.org`

2. Extract the `application.zip`, open the `/js/keypad.js` file and change the values in this line :

`Keypad.prototype.LONGPRESS_INTERVAL=1000;`
`Keypad.prototype.IDLE_INTERVAL=1000;`

in this way

`Keypad.prototype.LONGPRESS_INTERVAL=500;`
`Keypad.prototype.IDLE_INTERVAL=400;`

3. Push the app and its folder on the data partition, exactly in `/data/local/webapps` using a **temporary root access** :

`adb push keyboard.gaiamobile.org /data/local/webapps`

4. Get the `webapps.json` file :

`adb pull /data/local/webapps/webapps.json`

And change the value of the `keyboard.gaiamobile.org` app :

    "basePath": "/system/b2g/webapps",

in this way :

    "basePath": "/data/local/webapps",

Use the JSONLint website to verify that the format is correct for any json file you want to modify.

5. Afther this change push the `webapps.json` file in its place and reboot the phone :

`adb push webapps.json /data/local/webapps/`

`adb reboot`