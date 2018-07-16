# MMM-Nest-Camera

This is a module for the [MagicMirror²](https://github.com/MichMich/MagicMirror/).

Add Nest Cameras to Magic Mirror.

![screenshot](https://peter.build/magic-mirror/mmm-nest-camera.png?v=1.0.0)

## Installation

```bash
cd /path/to/MagicMirror
git clone https://github.com/manifestinteractive/MMM-Nest-Camera ./modules/MMM-Nest-Camera
```

## Generate Nest Token

You will need to run this for the `config.token` param.

```bash
cd ./modules/MMM-Nest-Camera
./getNestToken.sh
```

## Using the module

To use this module, add the following configuration block to the modules array in the `config/config.js` file:

```js
var config = {
  modules: [
    {
      module: 'MMM-Nest-Camera',
      position: 'middle_center',
      config: {
        token: 'xxxxxxxxxx',
        size: 'medium',
        onlineOnly: true,
        whereFilter: ['Back Yard']
      }
    }
  ]
}
```

## Configuration options

Option           | Type      | Default | Description
-----------------|-----------|---------|--------------------------------------------------------------
`animationSpeed` | `int`     | `0`     | Fade In Animation Speed
`updateInterval` | `int`     | `60000` | Frequency Update
`whereFilter`    | `array`   | `null`  | Only show Cameras with these names
`onlineOnly`     | `boolean` | `true`  | Only show Cameras that are currently online
`size`           | `string`  | `large` | One of the following sizes: `large`, `medium`, `small`, `mini`
`mode`           | `string`  | `image` | One of the following sizes: `image`, `video`

NOTE:  The `video` mode currently requires you to click the video to start playback.  The embedded iframe URL is supposed to autoplay, but it looks like this is not supported inside electron without user interaction.
