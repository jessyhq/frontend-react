# jessy

## philosophy
there are two components to jessy: **the workspace** and **the project tree**. both are separate from each other, but interoperate to create nuanced user experiences. here's an example: a user may have many workspaces, but no projects in the project tree. on the other hand, a user may only have one workspace, but several projects.

## what is a workspace?
workspaces are akin to desktops. they are digital environments that you can customize to your own liking, by adding custom wallpapers, themes, font-types, and much more. however, the true strength of a workspace is in the **extensions**.

## ok, now what is an extension?
an extension is a widget or an app that you like a timer, a tasks

task widgets should be connected internally to share the same state (but show different tasks based on project selected). the hierarchy is: projects > boards (can be used as kanban) > items (tasks/cards/notes/documents)

## structure of indexedDB
```ts
const IDB = {
  workspaces: [
    {
      _id: "workspace-ID-1",
      value: {
        _hash: "hash",
        name: "workspace name",
        layout: [
          {
            h: 10,
            i: "extensionID1",
            type: "MUSIC",
            w: 10,
            x: 0,
            y: 0
          },
          {
            h: 10,
            i: "extensionID2",
            type: "TODO",
            w: 10,
            x: 10,
            y: 10
          }
        ],
        time: {
          createdAt: 0,
          lastEdited: 0
        }
      }
    }
  ],
  projects: [
    {
      _id: "project-ID-1",
      value: {
        _hash: "hash",
        boards: [
          {
            _id: "board-ID-1",
            icon: "🌱",
            name: "board 1"
          }
        ]
        name: "project name",
        time: {
          createdAt: 0,
          lastEdited: 0
        }
      }
    }
  ],
  boards: [
    {
      _id: "board-ID-1",
      value: {
        _hash: "hash",
        items: {
          "tasks": [ // Only keep preview information here.
            {
              _id: "board-ID-1",
              icon: "🌱",
              name: "board 1"
            }
          ],
          "cards": [
            {
              _id: "card-ID-1",
              icon: "🌱",
              name: "card 1"
            }
          ],
          "notes": [],
          "documents": []
        }
        name: "board 1",
        time: {
          createdAt: 0,
          lastEdited: 0
        }
      }
    }
  ]
}
```