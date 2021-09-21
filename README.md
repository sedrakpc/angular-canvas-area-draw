# angular-canvas-area-draw

Simple directive to draw polygons over image using canvas

### Demo: 
https://sedrakpc.github.io/

### Preview:
![alt tag](https://user-images.githubusercontent.com/6464002/134110411-d8397ae1-9d2d-4fd9-bceb-d6c557ad5026.png)

### Usage:

```html
<div canvas-area-draw points="points"
     active="activePolygon" image-url="imageSrc"
     enabled="enabled" palette="colorArray"></div>
```
### Parameters

_Param name_    | _Description_ 
----------------|---------------
points          | where to store drawing polygons coordinates 
active          | current active polygon
image-url       | background image url
enabled         | is drawing enabled
colorArray      | color array with hex colors for every polygon layer, if color not specified for layer will be generated randomly
