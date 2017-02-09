# angular-canvas-area-draw

Simple directive to draw polygons over image using canvas

### Demo: 
https://sedrakpc.github.io/

### Preview:
![alt tag](https://cloud.githubusercontent.com/assets/6464002/22788262/182d8192-ef01-11e6-8da0-903c1ddfa70f.png)

### Usage:

```html
<div canvas-area-draw points="points"
     active="activePolygon" image-url="imageSrc"
     enabled="enabled" palette="colorArray"></div>
```
### Parameters

_Param name_    | _Description_ | _Streaming_        | _Polling_
----------------|---------------|--------------------|-------------------
IE 8, 9         | same as above | iframe-htmlfile    | iframe-xhr-polling
Other           | same as above | iframe-eventsource | iframe-xhr-polling
