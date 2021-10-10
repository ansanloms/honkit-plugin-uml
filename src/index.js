import { generate } from "node-plantuml";

export const blocks = {
  uml: {
    process: async function (block) {
      const config = {
        format: "png",
        charset: "utf8",
        config: "classic",
      };
      Object.assign(config, this.config.get("pluginsConfig.uml", {}));

      let uml = block.body;
      if (config.format === "ascii" || config.format === "unicode") {
        uml = uml.replace("@startuml", "").replace("@enduml", "");
      }

      const gen = generate(uml, {
        format: config.format,
        charset: config.charset,
        config: config.config,
      });

      const chunks = [];
      for await (const chunk of gen.out) {
        chunks.push(chunk);
      }

      const buf = Buffer.concat(chunks);

      switch (config.format) {
        case "ascii":
        case "unicode":
          const asciiHtml = buf
            .toString(config.charset)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

          return `<pre>${asciiHtml}</pre>`;

        case "svg":
          return `<img src="data:image/svg+xml;base64,${buf.toString(
            "base64"
          )}">`;

        case "png":
        default:
          return `<img src="data:image/png;base64,${buf.toString("base64")}">`;
      }
    },
  },
};
export const hooks = {
  "page:before": function (page) {
    // markdown
    page.content = page.content.replace(
      /```(uml|puml|plantuml)((.*[\r\n]+)+?)?```/gim,
      (match) =>
        match
          .replace(/```(uml|puml|plantuml)/i, "{% uml %}")
          .replace(/```/, "{% enduml %}")
    );

    // asciidoc
    page.content = page.content.replace(
      /\[source,(uml|puml|plantuml)\]\r?\n----((.*[\r\n]+)+?)?----/gim,
      (match) =>
        match
          .replace(/\[source,(uml|puml|plantuml)\]\r?\n----/i, "{% uml %}")
          .replace(/----/, "{% enduml %}")
    );

    return page;
  },
};
