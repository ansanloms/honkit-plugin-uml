import { generate } from "node-plantuml";

import clonedeep from "lodash/cloneDeep";

const defaultConfig = {
  format: "png",
  charset: "utf8",
  config: "classic",
};

export const blocks = {
  uml: {
    process: async function(block) {
      const config = clonedeep(defaultConfig);
      Object.assign(config, this.config.get("pluginsConfig.uml", {}));

      let uml = block.body;
      if (config.format === "ascii" || config.format === "unicode") {
        uml = uml.replace("@startuml", "").replace("@enduml", "");
      }

      const gen = generate(uml, {
        format: config.format,
        charset: config.charset,
        config: config.config
      });

      const chunks = [];
      for await (const chunk of gen.out) {
        chunks.push(chunk);
      }

      const buffer = Buffer.concat(chunks);

      switch (config.format) {
        case "ascii":
        case "unicode":
          const asciiHtml = buffer.toString(config.charset)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');

          return `<pre>${asciiHtml}</pre>`;

        case "svg":
          return `<img src="data:image/svg+xml;base64,${buffer.toString("base64")}">`;

        case "png":
        default:
          return `<img src="data:image/png;base64,${buffer.toString("base64")}">`;
      }
    }
  }
};
export const hooks = {
  "page:before": function(page) {
    // markdown
    page.content = page.content.replace(/```(uml|puml|plantuml)((.*[\r\n]+)+?)?```/igm, match => match.replace(/```(uml|puml|plantuml)/i, "{% uml %}").replace(/```/, "{% enduml %}"));

    // asciidoc
    page.content = page.content.replace(/\[source,(uml|puml|plantuml)\]\r?\n----((.*[\r\n]+)+?)?----/igm, match => match.replace(/\[source,(uml|puml|plantuml)\]\r?\n----/i, "{% uml %}").replace(/----/, "{% enduml %}"));

    return page;
  }
};
