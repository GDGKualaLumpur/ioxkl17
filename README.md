![preview-web](http://i.imgur.com/HqEltnk.png)

# Project Samarium

> Project Samarium is a conference website template for GDG after [Project Cerium](https://github.com/limhenry/cerium) with a newer design.

> Template is brought by [Henry Lim](https://twitter.com/henrylim96) from [GDG Kuala Lumpur](https://www.facebook.com/GDGKualaLumpur/).

> *Do you :heart: it?* Show your support - please, :star: the project.

:zap: [Live demo](https://tfxkl2017.firebaseapp.com/)

## Features
:white_check_mark: Polymer  
:white_check_mark: Responsive  
:white_check_mark: [PRPL pattern](https://www.polymer-project.org/1.0/toolbox/server)  
:white_check_mark: Optimized and fast  
:white_check_mark: Editable theme colors  

## Setup

### Prerequisites

Install [polymer-cli](https://github.com/Polymer/polymer-cli):

    npm i -g polymer-cli

and [Bower](https://bower.io/):

    npm i -g bower

:point_right: **[Fork](https://github.com/limhenry/samarium/fork) this repository** and clone it locally.

#### Install dependencies

    bower install

#### Start the development server

This command serves the app at `http://localhost:8080` and provides basic URL
routing for the app:

    polymer serve
    
### Configure
#### SEO
The project doesn't use any generators, so there is a need to edit manually
meta data in `index.html`
```
<head>
  <title>TensorFlow Dev Summit 2017 Extended Kuala Lumpur</title>
  <meta name="description"
        content="TensorFlow Dev Summit 2017 will be EXTENDED to our beloved city Kuala Lumpur! Let's have a day to learn about TensorFlow with industry experts via talks and codelabs!">
  <meta name="author" content="Henry Lim, GDG Kuala Lumpur">
  ...
```
#### Google Analytics
Replace GA tracking code in `index.html`
```
ga('create', 'UA-XXXXXXXX-X', 'auto');
```
#### Site Content
The most important file of configuration is data/data.json which looks like:
```
    "general": {...},
    "navigation": [...],
    "location": {...},
    "agenda": {...},
    "speakers": [...],
    "partners": [...]
```

#### Styling
Styling of your app can be found in `src/shared-styles.html`.
 
##### Colors
Generate your own color scheme with [Material Palette](https://www.materialpalette.com/) and click download Polymer
![material_design_palette_generator](https://cloud.githubusercontent.com/assets/2954281/17750340/a02f8e76-64ca-11e6-80f0-53392b30f89a.png)

Now Replace next section
```
--dark-primary-color:       #E64A19;
--default-primary-color:    #FF5722;
--light-primary-color:      #FFCCBC;
--text-primary-color:       #FFFFFF;
--accent-color:             #607D8B;
--primary-background-color: #FFCCBC;
--primary-text-color:       #414141;
--secondary-text-color:     #757575;
--disabled-text-color:      #BDBDBD;
--divider-color:            #BDBDBD;
```
## Build

This command performs HTML, CSS, and JS minification on the application
dependencies, and generates a service-worker.js file with code to pre-cache the
dependencies based on the entrypoint and fragments specified in `polymer.json`.
The minified files are output to the `build/unbundled` folder, and are suitable
for serving from a HTTP/2+Push compatible server.

In addition the command also creates a fallback `build/bundled` folder,
generated using fragment bundling, suitable for serving from non
H2/push-compatible servers or to clients that do not support H2/Push.

    polymer build

## Who uses the template?

Going to use the template? Go on! The only thing we ask - let us know with a
pull request, so we can include you in this list.

|Event Name|Link|Organization|
|------|------|------|
| TensorFlow Dev Summit 2017 Extended Kuala Lumpur | [https://tfxkl2017.firebaseapp.com/](https://tfxkl2017.firebaseapp.com/)|GDG Kuala Lumpur|

## Roadmap :rocket:
:x: Offline access  
:x: Service worker  
:x: Animation  
:x: Push notification    
:x: Polymer 2.0/ES2015  
:x: Accessibility    
:x: Unit/Integration Tests    
:point_right: __Propose your feature with [creating an issue](https://github.com/limhenry/samarium/issues/new)__

## Contributing

Project Samarium is still under development, and it is open for contributions.
Feel free to send PR. If you have any questions, feel free to contact
[Henry Lim](https://twitter.com/henrylim96).

## General workflow
1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Make your changes
4. Run the tests, adding new ones for your code if necessary
5. Commit your changes (`git commit -am 'Added some feature'`)
6. Push to the branch (`git push origin my-new-feature`)
7. Create new Pull Request

## License

Project is published under the [MIT license](https://github.com/limhenry/samarium/blob/master/LICENSE.md).  
Feel free to clone and modify repo as you want, but don't forget to add reference to authors :)