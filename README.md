# honkit-plugin-uml

[PlantUML](https://plantuml.com/) Plugin for [HonKit](https://github.com/HonKit/HonKit).

## Install

```
npm install git+https://github.com/ansanloms/honkit-plugin-uml.git --save-dev
```

## Usage

Add the plugin to `book.json` .

```json
{
  "plugins": ["@ansanloms/uml"]
}
```

## Options

```json
"pluginsConfig": {
  "uml": {
     "format": "svg",
     "charset": "utf8",
     "config": "classic"
  }
}
```

- `format`
	+ Format of the generated images. `png` , `svg` , `ascii` .
- `charset`
	+ Use a specific charset.
- `config`
	+ design settings. `classic` , `monochrome` or file path.

