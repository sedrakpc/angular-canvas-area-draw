# angular-canvas-area-draw

Simple directive to draw polygons over image using canvas

### Demo: 
 this demo does not support zoom feature: https://sedrakpc.github.io/

### Preview:
![alt tag](https://cloud.githubusercontent.com/assets/6464002/22788262/182d8192-ef01-11e6-8da0-903c1ddfa70f.png)

### Usage:

```html
<div canvas-area-draw points="points" double-click="DoubleClickEvent()"
     original-size="originalSize" active="0"
     image-url="imagePath" style="width: 500px;height: 500px;"
     editable="false" palette="Palette"></div>

```
### Parameters

_Param name_    | _Description_ 
----------------|---------------
points          | where to store drawing polygons coordinates 
active          | current active polygon
image-url       | background image url
editable        | is drawing enabled
double-click    | double click event on image
original-size   | size of images when points are made
colorArray      | color array with hex colors for every polygon layer, if color not specified for layer will be generated randomly
