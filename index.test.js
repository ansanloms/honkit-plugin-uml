const uml = require("./index");

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

const result_png = '<img src="data:image/png;base64,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">';

const result_svg = '<img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBjb250ZW50U2NyaXB0VHlwZT0iYXBwbGljYXRpb24vZWNtYXNjcmlwdCIgY29udGVudFN0eWxlVHlwZT0idGV4dC9jc3MiIGhlaWdodD0iMjE4cHgiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiIHN0eWxlPSJ3aWR0aDoyMjlweDtoZWlnaHQ6MjE4cHg7IiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAyMjkgMjE4IiB3aWR0aD0iMjI5cHgiIHpvb21BbmRQYW49Im1hZ25pZnkiPjxkZWZzLz48Zz48bGluZSBzdHlsZT0ic3Ryb2tlOiAjMDAwMDAwOyBzdHJva2Utd2lkdGg6IDEuMDsgc3Ryb2tlLWRhc2hhcnJheTogNS4wLDUuMDsiIHgxPSIzMCIgeDI9IjMwIiB5MT0iMzUuNjA5NCIgeTI9IjE3Ny4wMTU2Ii8+PGxpbmUgc3R5bGU9InN0cm9rZTogIzAwMDAwMDsgc3Ryb2tlLXdpZHRoOiAxLjA7IHN0cm9rZS1kYXNoYXJyYXk6IDUuMCw1LjA7IiB4MT0iMTk4LjUiIHgyPSIxOTguNSIgeTE9IjM1LjYwOTQiIHkyPSIxNzcuMDE1NiIvPjxyZWN0IGZpbGw9IiNGRkZGRkYiIGhlaWdodD0iMzEuNjA5NCIgc3R5bGU9InN0cm9rZTogIzAwMDAwMDsgc3Ryb2tlLXdpZHRoOiAxLjU7IiB3aWR0aD0iNDQiIHg9IjgiIHk9IjMiLz48dGV4dCBmaWxsPSIjMDAwMDAwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgbGVuZ3RoQWRqdXN0PSJzcGFjaW5nQW5kR2x5cGhzIiB0ZXh0TGVuZ3RoPSIzMCIgeD0iMTUiIHk9IjI0LjUzMzIiPkFsaWNlPC90ZXh0PjxyZWN0IGZpbGw9IiNGRkZGRkYiIGhlaWdodD0iMzEuNjA5NCIgc3R5bGU9InN0cm9rZTogIzAwMDAwMDsgc3Ryb2tlLXdpZHRoOiAxLjU7IiB3aWR0aD0iNDQiIHg9IjgiIHk9IjE3Ni4wMTU2Ii8+PHRleHQgZmlsbD0iIzAwMDAwMCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGxlbmd0aEFkanVzdD0ic3BhY2luZ0FuZEdseXBocyIgdGV4dExlbmd0aD0iMzAiIHg9IjE1IiB5PSIxOTcuNTQ4OCI+QWxpY2U8L3RleHQ+PHJlY3QgZmlsbD0iI0ZGRkZGRiIgaGVpZ2h0PSIzMS42MDk0IiBzdHlsZT0ic3Ryb2tlOiAjMDAwMDAwOyBzdHJva2Utd2lkdGg6IDEuNTsiIHdpZHRoPSIzOSIgeD0iMTc5LjUiIHk9IjMiLz48dGV4dCBmaWxsPSIjMDAwMDAwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgbGVuZ3RoQWRqdXN0PSJzcGFjaW5nQW5kR2x5cGhzIiB0ZXh0TGVuZ3RoPSIyNSIgeD0iMTg2LjUiIHk9IjI0LjUzMzIiPkJvYjwvdGV4dD48cmVjdCBmaWxsPSIjRkZGRkZGIiBoZWlnaHQ9IjMxLjYwOTQiIHN0eWxlPSJzdHJva2U6ICMwMDAwMDA7IHN0cm9rZS13aWR0aDogMS41OyIgd2lkdGg9IjM5IiB4PSIxNzkuNSIgeT0iMTc2LjAxNTYiLz48dGV4dCBmaWxsPSIjMDAwMDAwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgbGVuZ3RoQWRqdXN0PSJzcGFjaW5nQW5kR2x5cGhzIiB0ZXh0TGVuZ3RoPSIyNSIgeD0iMTg2LjUiIHk9IjE5Ny41NDg4Ij5Cb2I8L3RleHQ+PHBvbHlnb24gZmlsbD0iIzAwMDAwMCIgcG9pbnRzPSIxODcsNjMuOTYwOSwxOTcsNjcuOTYwOSwxODcsNzEuOTYwOSwxOTEsNjcuOTYwOSIgc3R5bGU9InN0cm9rZTogIzAwMDAwMDsgc3Ryb2tlLXdpZHRoOiAxLjA7Ii8+PGxpbmUgc3R5bGU9InN0cm9rZTogIzAwMDAwMDsgc3Ryb2tlLXdpZHRoOiAxLjA7IiB4MT0iMzAiIHgyPSIxOTMiIHkxPSI2Ny45NjA5IiB5Mj0iNjcuOTYwOSIvPjx0ZXh0IGZpbGw9IiMwMDAwMDAiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjEzIiBsZW5ndGhBZGp1c3Q9InNwYWNpbmdBbmRHbHlwaHMiIHRleHRMZW5ndGg9IjEzNSIgeD0iMzciIHk9IjYzLjEwNDUiPkF1dGhlbnRpY2F0aW9uIFJlcXVlc3Q8L3RleHQ+PHBvbHlnb24gZmlsbD0iIzAwMDAwMCIgcG9pbnRzPSI0MSw5NC4zMTI1LDMxLDk4LjMxMjUsNDEsMTAyLjMxMjUsMzcsOTguMzEyNSIgc3R5bGU9InN0cm9rZTogIzAwMDAwMDsgc3Ryb2tlLXdpZHRoOiAxLjA7Ii8+PGxpbmUgc3R5bGU9InN0cm9rZTogIzAwMDAwMDsgc3Ryb2tlLXdpZHRoOiAxLjA7IHN0cm9rZS1kYXNoYXJyYXk6IDIuMCwyLjA7IiB4MT0iMzUiIHgyPSIxOTgiIHkxPSI5OC4zMTI1IiB5Mj0iOTguMzEyNSIvPjx0ZXh0IGZpbGw9IiMwMDAwMDAiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjEzIiBsZW5ndGhBZGp1c3Q9InNwYWNpbmdBbmRHbHlwaHMiIHRleHRMZW5ndGg9IjE0NSIgeD0iNDciIHk9IjkzLjQ1NjEiPkF1dGhlbnRpY2F0aW9uIFJlc3BvbnNlPC90ZXh0Pjxwb2x5Z29uIGZpbGw9IiMwMDAwMDAiIHBvaW50cz0iMTg3LDEyNC42NjQxLDE5NywxMjguNjY0MSwxODcsMTMyLjY2NDEsMTkxLDEyOC42NjQxIiBzdHlsZT0ic3Ryb2tlOiAjMDAwMDAwOyBzdHJva2Utd2lkdGg6IDEuMDsiLz48bGluZSBzdHlsZT0ic3Ryb2tlOiAjMDAwMDAwOyBzdHJva2Utd2lkdGg6IDEuMDsiIHgxPSIzMCIgeDI9IjE5MyIgeTE9IjEyOC42NjQxIiB5Mj0iMTI4LjY2NDEiLz48dGV4dCBmaWxsPSIjMDAwMDAwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMyIgbGVuZ3RoQWRqdXN0PSJzcGFjaW5nQW5kR2x5cGhzIiB0ZXh0TGVuZ3RoPSI5MSIgeD0iMzciIHk9IjEyMy44MDc2Ij7oqo3oqLzjg6rjgq/jgqjjgrnjg4g8L3RleHQ+PHBvbHlnb24gZmlsbD0iIzAwMDAwMCIgcG9pbnRzPSI0MSwxNTUuMDE1NiwzMSwxNTkuMDE1Niw0MSwxNjMuMDE1NiwzNywxNTkuMDE1NiIgc3R5bGU9InN0cm9rZTogIzAwMDAwMDsgc3Ryb2tlLXdpZHRoOiAxLjA7Ii8+PGxpbmUgc3R5bGU9InN0cm9rZTogIzAwMDAwMDsgc3Ryb2tlLXdpZHRoOiAxLjA7IHN0cm9rZS1kYXNoYXJyYXk6IDIuMCwyLjA7IiB4MT0iMzUiIHgyPSIxOTgiIHkxPSIxNTkuMDE1NiIgeTI9IjE1OS4wMTU2Ii8+PHRleHQgZmlsbD0iIzAwMDAwMCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTMiIGxlbmd0aEFkanVzdD0ic3BhY2luZ0FuZEdseXBocyIgdGV4dExlbmd0aD0iOTEiIHg9IjQ3IiB5PSIxNTQuMTU5MiI+6KqN6Ki844Os44K544Od44Oz44K5PC90ZXh0PjwhLS0KQHN0YXJ0dW1sDQpza2lucGFyYW0gc2hhZG93aW5nIGZhbHNlDQpoaWRlIGNpcmNsZQ0KDQpza2lucGFyYW0gbm90ZUJhY2tncm91bmRDb2xvciBXaGl0ZQ0Kc2tpbnBhcmFtIG5vdGVCb3JkZXJDb2xvciBCbGFjaw0KDQpza2lucGFyYW0gcGFja2FnZUJhY2tncm91bmRDb2xvciBXaGl0ZQ0Kc2tpbnBhcmFtIHBhY2thZ2VCb3JkZXJDb2xvciBCbGFjaw0Kc2tpbnBhcmFtIGNsYXNzQXR0cmlidXRlSWNvblNpemUgMA0Kc2tpbnBhcmFtIGNsYXNzIHsNCiAgQmFja2dyb3VuZENvbG9yIFdoaXRlDQogIEFycm93Q29sb3IgQmxhY2sNCiAgQm9yZGVyQ29sb3IgQmxhY2sNCn0NCg0Kc2tpbnBhcmFtIHNlcXVlbmNlIHsNCiAgQXJyb3dDb2xvciBCbGFjaw0KICBQYXJ0aWNpcGFudEJvcmRlckNvbG9yIEJsYWNrDQogIFBhcnRpY2lwYW50QmFja2dyb3VuZENvbG9yIFdoaXRlDQogIExpZmVMaW5lQm9yZGVyQ29sb3IgQmxhY2sNCn0NCg0Kc2tpbnBhcmFtIHVzZWNhc2Ugew0KICBCYWNrZ3JvdW5kQ29sb3IgV2hpdGUNCiAgQXJyb3dDb2xvciBCbGFjaw0KICBCb3JkZXJDb2xvciBCbGFjaw0KfQ0KQWxpY2UgLT4gQm9iOiBBdXRoZW50aWNhdGlvbiBSZXF1ZXN0DQpCb2IgLSAtPiBBbGljZTogQXV0aGVudGljYXRpb24gUmVzcG9uc2UNCg0KQWxpY2UgLT4gQm9iOiDoqo3oqLzjg6rjgq/jgqjjgrnjg4gNCkFsaWNlIDwtIC0gQm9iOiDoqo3oqLzjg6zjgrnjg53jg7PjgrkNCkBlbmR1bWwNCgpQbGFudFVNTCB2ZXJzaW9uIDEuMjAxOS4wNihTYXQgTWF5IDI1IDAyOjEwOjI1IEpTVCAyMDE5KQooR1BMIHNvdXJjZSBkaXN0cmlidXRpb24pCkphdmEgUnVudGltZTogSmF2YShUTSkgU0UgUnVudGltZSBFbnZpcm9ubWVudApKVk06IEphdmEgSG90U3BvdChUTSkgNjQtQml0IFNlcnZlciBWTQpKYXZhIFZlcnNpb246IDE0KzM2LTE0NjEKT3BlcmF0aW5nIFN5c3RlbTogV2luZG93cyAxMApPUyBWZXJzaW9uOiAxMC4wCkRlZmF1bHQgRW5jb2Rpbmc6IE1TOTMyCkxhbmd1YWdlOiBqYQpDb3VudHJ5OiBKUAotLT48L2c+PC9zdmc+PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBjb250ZW50U2NyaXB0VHlwZT0iYXBwbGljYXRpb24vZWNtYXNjcmlwdCIgY29udGVudFN0eWxlVHlwZT0idGV4dC9jc3MiIGhlaWdodD0iMTJweCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSIgc3R5bGU9IndpZHRoOjEycHg7aGVpZ2h0OjEycHg7IiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAxMiAxMiIgd2lkdGg9IjEycHgiIHpvb21BbmRQYW49Im1hZ25pZnkiPjxkZWZzLz48Zz48IS0tCkBzdGFydHVtbA0Kc2tpbnBhcmFtIHNoYWRvd2luZyBmYWxzZQ0KaGlkZSBjaXJjbGUNCg0Kc2tpbnBhcmFtIG5vdGVCYWNrZ3JvdW5kQ29sb3IgV2hpdGUNCnNraW5wYXJhbSBub3RlQm9yZGVyQ29sb3IgQmxhY2sNCg0Kc2tpbnBhcmFtIHBhY2thZ2VCYWNrZ3JvdW5kQ29sb3IgV2hpdGUNCnNraW5wYXJhbSBwYWNrYWdlQm9yZGVyQ29sb3IgQmxhY2sNCnNraW5wYXJhbSBjbGFzc0F0dHJpYnV0ZUljb25TaXplIDANCnNraW5wYXJhbSBjbGFzcyB7DQogIEJhY2tncm91bmRDb2xvciBXaGl0ZQ0KICBBcnJvd0NvbG9yIEJsYWNrDQogIEJvcmRlckNvbG9yIEJsYWNrDQp9DQoNCnNraW5wYXJhbSBzZXF1ZW5jZSB7DQogIEFycm93Q29sb3IgQmxhY2sNCiAgUGFydGljaXBhbnRCb3JkZXJDb2xvciBCbGFjaw0KICBQYXJ0aWNpcGFudEJhY2tncm91bmRDb2xvciBXaGl0ZQ0KICBMaWZlTGluZUJvcmRlckNvbG9yIEJsYWNrDQp9DQoNCnNraW5wYXJhbSB1c2VjYXNlIHsNCiAgQmFja2dyb3VuZENvbG9yIFdoaXRlDQogIEFycm93Q29sb3IgQmxhY2sNCiAgQm9yZGVyQ29sb3IgQmxhY2sNCn0NCg0KDQpAZW5kdW1sDQoKUGxhbnRVTUwgdmVyc2lvbiAxLjIwMTkuMDYoU2F0IE1heSAyNSAwMjoxMDoyNSBKU1QgMjAxOSkKKEdQTCBzb3VyY2UgZGlzdHJpYnV0aW9uKQpKYXZhIFJ1bnRpbWU6IEphdmEoVE0pIFNFIFJ1bnRpbWUgRW52aXJvbm1lbnQKSlZNOiBKYXZhIEhvdFNwb3QoVE0pIDY0LUJpdCBTZXJ2ZXIgVk0KSmF2YSBWZXJzaW9uOiAxNCszNi0xNDYxCk9wZXJhdGluZyBTeXN0ZW06IFdpbmRvd3MgMTAKT1MgVmVyc2lvbjogMTAuMApEZWZhdWx0IEVuY29kaW5nOiBNUzkzMgpMYW5ndWFnZTogamEKQ291bnRyeTogSlAKLS0+PC9nPjwvc3ZnPg==">';


test("replace with ascii format", async () => {
  uml.hooks.config = {
    get: (output, config) => {
      return {
        format: "ascii",
        charset: "utf8",
        config: "classic",
      }
    }
  };

  expect(await uml.hooks["page:before"]({
    content: "```plantuml\n" + umlData_forAscii + "\n```"
  })).toEqual({
    content: result_ascii
  });
});

test("replace with unicode format", async () => {
  uml.hooks.config = {
    get: (output, config) => {
      return {
        format: "unicode",
        charset: "utf8",
        config: "classic",
      }
    }
  };

  expect(await uml.hooks["page:before"]({
    content: "```plantuml\n" + umlData + "\n```"
  })).toEqual({
    content: result_unicode
  });
});

test("replace with svg format", async () => {
  uml.hooks.config = {
    get: (output, config) => {
      return {
        format: "svg",
        charset: "utf8",
        config: "classic",
      }
    }
  };

  expect(await uml.hooks["page:before"]({
    content: "```plantuml\n" + umlData + "\n```"
  })).toEqual({
    content: result_svg
  });
});

test("replace with png format", async () => {
  uml.hooks.config = {
    get: (output, config) => {
      return {
        format: "png",
        charset: "utf8",
        config: "classic",
      }
    }
  };

  expect(await uml.hooks["page:before"]({
    content: "```plantuml\n" + umlData + "\n```"
  })).toEqual({
    content: result_png
  });
});

test("replace with default format", async () => {
  uml.hooks.config = {
    get: (output, config) => {
      return {}
    }
  };

  expect(await uml.hooks["page:before"]({
    content: "```plantuml\n" + umlData + "\n```"
  })).toEqual({
    content: result_png
  });
});

test("replace with other format", async () => {
  uml.hooks.config = {
    get: (output, config) => {
      return {
        format: "hoge", // 対応外の値は png になる
        charset: "utf8",
        config: "classic",
      }
    }
  };

  expect(await uml.hooks["page:before"]({
    content: "```plantuml\n" + umlData + "\n```"
  })).toEqual({
    content: result_png
  });
});

test("replace by ```uml``` tag", async () => {
  uml.hooks.config = {
    get: (output, config) => {
      return {
        format: "png",
        charset: "utf8",
        config: "classic",
      }
    }
  };

  expect(await uml.hooks["page:before"]({
    content: "```uml\n" + umlData + "\n```"
  })).toEqual({
    content: result_png
  });
});

test("replace by ```puml``` tag", async () => {
  uml.hooks.config = {
    get: (output, config) => {
      return {
        format: "png",
        charset: "utf8",
        config: "classic",
      }
    }
  };

  expect(await uml.hooks["page:before"]({
    content: "```puml\n" + umlData + "\n```"
  })).toEqual({
    content: result_png
  });
});

test("replace by ```plantuml``` tag", async () => {
  uml.hooks.config = {
    get: (output, config) => {
      return {
        format: "png",
        charset: "utf8",
        config: "classic",
      }
    }
  };

  expect(await uml.hooks["page:before"]({
    content: "```plantuml\n" + umlData + "\n```"
  })).toEqual({
    content: result_png
  });
});

