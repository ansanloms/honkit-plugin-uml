import { hooks, blocks } from "../src/index";

const umlData = `
@startuml
Alice -> Bob: Authentication Request
Bob --> Alice: Authentication Response

Alice -> Bob: 認証リクエスト
Alice <-- Bob: 認証レスポンス
@enduml
`;

// ascii ではマルチバイト文字は非対応なので
const umlData_forAscii = `
@startuml
Alice -> Bob: Authentication Request
Bob --> Alice: Authentication Response
@enduml
`;

const result_ascii = [
  '<pre>     ,-----.                   ,---.',
  '     |Alice|                   |Bob|',
  '     `--+--&#039;                   `-+-&#039;',
  '        |Authentication Request  |  ',
  '        |-----------------------&gt;|  ',
  '        |                        |  ',
  '        |Authentication Response |  ',
  '        |&lt;- - - - - - - - - - - -|  ',
  '     ,--+--.                   ,-+-.',
  '     |Alice|                   |Bob|',
  '     `-----&#039;                   `---&#039;',
  '</pre>'
].join("\r\n");

const result_unicode = [
  '<pre>     ┌─────┐                   ┌───┐',
  '     │Alice│                   │Bob│',
  '     └──┬──┘                   └─┬─┘',
  '        │Authentication Request  │  ',
  '        │───────────────────────&gt;│  ',
  '        │                        │  ',
  '        │Authentication Response │  ',
  '        │&lt;─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─│  ',
  '        │                        │  ',
  '        │    認証リクエスト      │  ',
  '        │───────────────────────&gt;│  ',
  '        │                        │  ',
  '        │    認証レスポンス      │  ',
  '        │&lt;─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─│  ',
  '     ┌──┴──┐                   ┌─┴─┐',
  '     │Alice│                   │Bob│',
  '     └─────┘                   └───┘',
  '</pre>'
].join("\r\n");

const result_png = "<img src=\"data:image/png;base64,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\">"

const result_svg = "<img src=\"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBjb250ZW50U2NyaXB0VHlwZT0iYXBwbGljYXRpb24vZWNtYXNjcmlwdCIgY29udGVudFN0eWxlVHlwZT0idGV4dC9jc3MiIGhlaWdodD0iMjE4cHgiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiIHN0eWxlPSJ3aWR0aDoyMjlweDtoZWlnaHQ6MjE4cHg7IiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAyMjkgMjE4IiB3aWR0aD0iMjI5cHgiIHpvb21BbmRQYW49Im1hZ25pZnkiPjxkZWZzLz48Zz48bGluZSBzdHlsZT0ic3Ryb2tlOiAjMDAwMDAwOyBzdHJva2Utd2lkdGg6IDEuMDsgc3Ryb2tlLWRhc2hhcnJheTogNS4wLDUuMDsiIHgxPSIzMCIgeDI9IjMwIiB5MT0iMzUuNjA5NCIgeTI9IjE3Ny4wMTU2Ii8+PGxpbmUgc3R5bGU9InN0cm9rZTogIzAwMDAwMDsgc3Ryb2tlLXdpZHRoOiAxLjA7IHN0cm9rZS1kYXNoYXJyYXk6IDUuMCw1LjA7IiB4MT0iMTk4LjUiIHgyPSIxOTguNSIgeTE9IjM1LjYwOTQiIHkyPSIxNzcuMDE1NiIvPjxyZWN0IGZpbGw9IiNGRkZGRkYiIGhlaWdodD0iMzEuNjA5NCIgc3R5bGU9InN0cm9rZTogIzAwMDAwMDsgc3Ryb2tlLXdpZHRoOiAxLjU7IiB3aWR0aD0iNDQiIHg9IjgiIHk9IjMiLz48dGV4dCBmaWxsPSIjMDAwMDAwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgbGVuZ3RoQWRqdXN0PSJzcGFjaW5nQW5kR2x5cGhzIiB0ZXh0TGVuZ3RoPSIzMCIgeD0iMTUiIHk9IjI0LjUzMzIiPkFsaWNlPC90ZXh0PjxyZWN0IGZpbGw9IiNGRkZGRkYiIGhlaWdodD0iMzEuNjA5NCIgc3R5bGU9InN0cm9rZTogIzAwMDAwMDsgc3Ryb2tlLXdpZHRoOiAxLjU7IiB3aWR0aD0iNDQiIHg9IjgiIHk9IjE3Ni4wMTU2Ii8+PHRleHQgZmlsbD0iIzAwMDAwMCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGxlbmd0aEFkanVzdD0ic3BhY2luZ0FuZEdseXBocyIgdGV4dExlbmd0aD0iMzAiIHg9IjE1IiB5PSIxOTcuNTQ4OCI+QWxpY2U8L3RleHQ+PHJlY3QgZmlsbD0iI0ZGRkZGRiIgaGVpZ2h0PSIzMS42MDk0IiBzdHlsZT0ic3Ryb2tlOiAjMDAwMDAwOyBzdHJva2Utd2lkdGg6IDEuNTsiIHdpZHRoPSIzOSIgeD0iMTc5LjUiIHk9IjMiLz48dGV4dCBmaWxsPSIjMDAwMDAwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgbGVuZ3RoQWRqdXN0PSJzcGFjaW5nQW5kR2x5cGhzIiB0ZXh0TGVuZ3RoPSIyNSIgeD0iMTg2LjUiIHk9IjI0LjUzMzIiPkJvYjwvdGV4dD48cmVjdCBmaWxsPSIjRkZGRkZGIiBoZWlnaHQ9IjMxLjYwOTQiIHN0eWxlPSJzdHJva2U6ICMwMDAwMDA7IHN0cm9rZS13aWR0aDogMS41OyIgd2lkdGg9IjM5IiB4PSIxNzkuNSIgeT0iMTc2LjAxNTYiLz48dGV4dCBmaWxsPSIjMDAwMDAwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgbGVuZ3RoQWRqdXN0PSJzcGFjaW5nQW5kR2x5cGhzIiB0ZXh0TGVuZ3RoPSIyNSIgeD0iMTg2LjUiIHk9IjE5Ny41NDg4Ij5Cb2I8L3RleHQ+PHBvbHlnb24gZmlsbD0iIzAwMDAwMCIgcG9pbnRzPSIxODcsNjMuOTYwOSwxOTcsNjcuOTYwOSwxODcsNzEuOTYwOSwxOTEsNjcuOTYwOSIgc3R5bGU9InN0cm9rZTogIzAwMDAwMDsgc3Ryb2tlLXdpZHRoOiAxLjA7Ii8+PGxpbmUgc3R5bGU9InN0cm9rZTogIzAwMDAwMDsgc3Ryb2tlLXdpZHRoOiAxLjA7IiB4MT0iMzAiIHgyPSIxOTMiIHkxPSI2Ny45NjA5IiB5Mj0iNjcuOTYwOSIvPjx0ZXh0IGZpbGw9IiMwMDAwMDAiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjEzIiBsZW5ndGhBZGp1c3Q9InNwYWNpbmdBbmRHbHlwaHMiIHRleHRMZW5ndGg9IjEzNSIgeD0iMzciIHk9IjYzLjEwNDUiPkF1dGhlbnRpY2F0aW9uIFJlcXVlc3Q8L3RleHQ+PHBvbHlnb24gZmlsbD0iIzAwMDAwMCIgcG9pbnRzPSI0MSw5NC4zMTI1LDMxLDk4LjMxMjUsNDEsMTAyLjMxMjUsMzcsOTguMzEyNSIgc3R5bGU9InN0cm9rZTogIzAwMDAwMDsgc3Ryb2tlLXdpZHRoOiAxLjA7Ii8+PGxpbmUgc3R5bGU9InN0cm9rZTogIzAwMDAwMDsgc3Ryb2tlLXdpZHRoOiAxLjA7IHN0cm9rZS1kYXNoYXJyYXk6IDIuMCwyLjA7IiB4MT0iMzUiIHgyPSIxOTgiIHkxPSI5OC4zMTI1IiB5Mj0iOTguMzEyNSIvPjx0ZXh0IGZpbGw9IiMwMDAwMDAiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjEzIiBsZW5ndGhBZGp1c3Q9InNwYWNpbmdBbmRHbHlwaHMiIHRleHRMZW5ndGg9IjE0NSIgeD0iNDciIHk9IjkzLjQ1NjEiPkF1dGhlbnRpY2F0aW9uIFJlc3BvbnNlPC90ZXh0Pjxwb2x5Z29uIGZpbGw9IiMwMDAwMDAiIHBvaW50cz0iMTg3LDEyNC42NjQxLDE5NywxMjguNjY0MSwxODcsMTMyLjY2NDEsMTkxLDEyOC42NjQxIiBzdHlsZT0ic3Ryb2tlOiAjMDAwMDAwOyBzdHJva2Utd2lkdGg6IDEuMDsiLz48bGluZSBzdHlsZT0ic3Ryb2tlOiAjMDAwMDAwOyBzdHJva2Utd2lkdGg6IDEuMDsiIHgxPSIzMCIgeDI9IjE5MyIgeTE9IjEyOC42NjQxIiB5Mj0iMTI4LjY2NDEiLz48dGV4dCBmaWxsPSIjMDAwMDAwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMyIgbGVuZ3RoQWRqdXN0PSJzcGFjaW5nQW5kR2x5cGhzIiB0ZXh0TGVuZ3RoPSI5MSIgeD0iMzciIHk9IjEyMy44MDc2Ij7oqo3oqLzjg6rjgq/jgqjjgrnjg4g8L3RleHQ+PHBvbHlnb24gZmlsbD0iIzAwMDAwMCIgcG9pbnRzPSI0MSwxNTUuMDE1NiwzMSwxNTkuMDE1Niw0MSwxNjMuMDE1NiwzNywxNTkuMDE1NiIgc3R5bGU9InN0cm9rZTogIzAwMDAwMDsgc3Ryb2tlLXdpZHRoOiAxLjA7Ii8+PGxpbmUgc3R5bGU9InN0cm9rZTogIzAwMDAwMDsgc3Ryb2tlLXdpZHRoOiAxLjA7IHN0cm9rZS1kYXNoYXJyYXk6IDIuMCwyLjA7IiB4MT0iMzUiIHgyPSIxOTgiIHkxPSIxNTkuMDE1NiIgeTI9IjE1OS4wMTU2Ii8+PHRleHQgZmlsbD0iIzAwMDAwMCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTMiIGxlbmd0aEFkanVzdD0ic3BhY2luZ0FuZEdseXBocyIgdGV4dExlbmd0aD0iOTEiIHg9IjQ3IiB5PSIxNTQuMTU5MiI+6KqN6Ki844Os44K544Od44Oz44K5PC90ZXh0PjwhLS0KQHN0YXJ0dW1sDQpza2lucGFyYW0gc2hhZG93aW5nIGZhbHNlDQpoaWRlIGNpcmNsZQ0KDQpza2lucGFyYW0gbm90ZUJhY2tncm91bmRDb2xvciBXaGl0ZQ0Kc2tpbnBhcmFtIG5vdGVCb3JkZXJDb2xvciBCbGFjaw0KDQpza2lucGFyYW0gcGFja2FnZUJhY2tncm91bmRDb2xvciBXaGl0ZQ0Kc2tpbnBhcmFtIHBhY2thZ2VCb3JkZXJDb2xvciBCbGFjaw0Kc2tpbnBhcmFtIGNsYXNzQXR0cmlidXRlSWNvblNpemUgMA0Kc2tpbnBhcmFtIGNsYXNzIHsNCiAgQmFja2dyb3VuZENvbG9yIFdoaXRlDQogIEFycm93Q29sb3IgQmxhY2sNCiAgQm9yZGVyQ29sb3IgQmxhY2sNCn0NCg0Kc2tpbnBhcmFtIHNlcXVlbmNlIHsNCiAgQXJyb3dDb2xvciBCbGFjaw0KICBQYXJ0aWNpcGFudEJvcmRlckNvbG9yIEJsYWNrDQogIFBhcnRpY2lwYW50QmFja2dyb3VuZENvbG9yIFdoaXRlDQogIExpZmVMaW5lQm9yZGVyQ29sb3IgQmxhY2sNCn0NCg0Kc2tpbnBhcmFtIHVzZWNhc2Ugew0KICBCYWNrZ3JvdW5kQ29sb3IgV2hpdGUNCiAgQXJyb3dDb2xvciBCbGFjaw0KICBCb3JkZXJDb2xvciBCbGFjaw0KfQ0KQWxpY2UgLT4gQm9iOiBBdXRoZW50aWNhdGlvbiBSZXF1ZXN0DQpCb2IgLSAtPiBBbGljZTogQXV0aGVudGljYXRpb24gUmVzcG9uc2UNCg0KQWxpY2UgLT4gQm9iOiDoqo3oqLzjg6rjgq/jgqjjgrnjg4gNCkFsaWNlIDwtIC0gQm9iOiDoqo3oqLzjg6zjgrnjg53jg7PjgrkNCkBlbmR1bWwNCgpQbGFudFVNTCB2ZXJzaW9uIDEuMjAxOS4wNihTYXQgTWF5IDI1IDAyOjEwOjI1IEpTVCAyMDE5KQooR1BMIHNvdXJjZSBkaXN0cmlidXRpb24pCkphdmEgUnVudGltZTogT3BlbkpESyBSdW50aW1lIEVudmlyb25tZW50CkpWTTogT3BlbkpESyA2NC1CaXQgU2VydmVyIFZNCkphdmEgVmVyc2lvbjogMTQuMC4xKzcKT3BlcmF0aW5nIFN5c3RlbTogV2luZG93cyAxMApPUyBWZXJzaW9uOiAxMC4wCkRlZmF1bHQgRW5jb2Rpbmc6IE1TOTMyCkxhbmd1YWdlOiBqYQpDb3VudHJ5OiBKUAotLT48L2c+PC9zdmc+\">"

test("replace ```uml", () => {
  expect(hooks["page:before"]({
    content: "```uml\n" + umlData + "\n```"
  })).toEqual({
    content: "{% uml %}\n" + umlData + "\n{% enduml %}"
  });
});

test("replace ```puml", () => {
  expect(hooks["page:before"]({
    content: "```puml\n" + umlData + "\n```"
  })).toEqual({
    content: "{% uml %}\n" + umlData + "\n{% enduml %}"
  });
});

test("replace ```plantuml", () => {
  expect(hooks["page:before"]({
    content: "```plantuml\n" + umlData + "\n```"
  })).toEqual({
    content: "{% uml %}\n" + umlData + "\n{% enduml %}"
  });
});

test("not replace ```hoge", () => {
  expect(hooks["page:before"]({
    content: "```hoge\n" + umlData + "\n```\n\n```plantuml\n" + umlData + "\n```"
  })).toEqual({
    content: "```hoge\n" + umlData + "\n```\n\n{% uml %}\n" + umlData + "\n{% enduml %}"
  });
});

test("replace [source,plantuml]", () => {
  expect(hooks["page:before"]({
    content: "[source,plantuml]\n----\n" + umlData + "\n----"
  })).toEqual({
    content: "{% uml %}\n" + umlData + "\n{% enduml %}"
  });
});

test("replace [source,puml]", () => {
  expect(hooks["page:before"]({
    content: "[source,puml]\n----\n" + umlData + "\n----"
  })).toEqual({
    content: "{% uml %}\n" + umlData + "\n{% enduml %}"
  });
});

test("replace [source,uml]", () => {
  expect(hooks["page:before"]({
    content: "[source,uml]\n----\n" + umlData + "\n----"
  })).toEqual({
    content: "{% uml %}\n" + umlData + "\n{% enduml %}"
  });
});

test("not replace [source,hoge]", () => {
  expect(hooks["page:before"]({
    content: "[source,hoge]\n----\n" + umlData + "\n----\n\n[source,plantuml]\n----\n" + umlData + "\n----"
  })).toEqual({
    content: "[source,hoge]\n----\n" + umlData + "\n----\n\n{% uml %}\n" + umlData + "\n{% enduml %}"
  });
});

test("replace with ascii format", async () => {
  blocks.uml.config = {
    get: (output, config) => {
      return {
        format: "ascii",
        charset: "utf8",
        config: "classic",
      }
    }
  };

  expect(await blocks.uml.process({
    body: umlData_forAscii
  })).toEqual(result_ascii);
});

test("replace with unicode format", async () => {
  blocks.uml.config = {
    get: (output, config) => {
      return {
        format: "unicode",
        charset: "utf8",
        config: "classic",
      }
    }
  };

  expect(await blocks.uml.process({
    body: umlData
  })).toEqual(result_unicode);
});

test("replace with svg format", async () => {
  blocks.uml.config = {
    get: (output, config) => {
      return {
        format: "svg",
        charset: "utf8",
        config: "classic",
      }
    }
  };

  expect(await blocks.uml.process({
    body: umlData
  })).toEqual(result_svg);
});

test("replace with png format", async () => {
  blocks.uml.config = {
    get: (output, config) => {
      return {
        format: "png",
        charset: "utf8",
        config: "classic",
      }
    }
  };

  expect(await blocks.uml.process({
    body: umlData
  })).toEqual(result_png);
});

test("replace with default format", async () => {
  blocks.uml.config = {
    get: (output, config) => {
      return {}
    }
  };

  expect(await blocks.uml.process({
    body: umlData
  })).toEqual(result_png);
});

test("replace with other format", async () => {
  blocks.uml.config = {
    get: (output, config) => {
      return {
        format: "hoge", // 対応外の値は png になる
        charset: "utf8",
        config: "classic",
      }
    }
  };

  expect(await blocks.uml.process({
    body: umlData
  })).toEqual(result_png);
});
