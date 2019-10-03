# Carousel
### Lightweight Front-end library for image sliders and carousels

Carousel is written entirely with ES5 and wil run on all major browsers.

To use this library, add the following files to your website :
> Carousel/carousel.js

> Carousel/carousel.css


### USAGE
###### HTML
- Create an *container* element in your HTML. Style it however you want, **Carousel** will use it as a canvas for your images.
Any content inside the *container* element will be deleted.
```
<html>
<body>
  ...
    <div id="container">
    </div>
  ...
</body>
</html>
```



###### JavaScript
**Carousel** exposes a global instatiator with simple configurations.


- Create an array containing the links to your images.
```
<script>
  var images = [ 'image_one.jpg', 'IMG/cool_pic.png'}
</script>
```

- Create a settings object 
```
<script>
  var settings = {
    el : "#sliderAuto",// REQUIRED. STRING or HTML Element. The element to be used as a container for the slide. any existing children will be removed.
    loop : true, // OPTIONAL. BOOLEAN. Tells Carousel to loop continiously over the images. Only effective when the .next(), .previous or .seek() methods are called. Default is false
    scroll : 3000, // OPTIONAL. NUMBER. The timeout for automatic scrolling. Default is 0.
    stretch : true,// OPTIONAL. BOOLEAN. Tells Carousel to stretch the images in this slide. Default is false
    padding : "10%",// OPTIONAL. STRING. Can be any valid value type (px, em, %, rem etc). If no value type is specified, px is used.
    fill : "#000"// OPTIONAL. STRING. Can be any valid color format  ("black", rgb etc)
  }
</script>
```

- Initialize your carousel from anywhere in your script by calling on the global Carousel instantiator.
```
<script>
  var slider = new Carousel(images, settings);
</script>
```

- The carousel instance returns an object with two methods
```
<script>
  slider.add('IMG/selfie.jpg'); //  Adds a new image to the slider container
  
  slider.remove('image_one.jpg'); // Removes the image from the slider container
  
  slider.next(); // Scrolls to the next image in the slider
  
  slider.prev(); // Scrolls to the previous image in the slider
  
  slider.seek('1'); // Scrolls to the second (index 1) object in the slider
</script>
```


###### Carousel is still in production. Any suggestions are welcome
