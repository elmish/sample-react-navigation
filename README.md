# Handling browser navigation implemented in F# and targeting Fable.

This is a navigation sample ported from Elm.
In addition to `init`, `update`, `view` functions it introduces `hashParser` and `urlUpdate` to handle browser navigation events.

For more information about it see [the docs](https://fable-elmish.github.io/browser).
Pre-built SPA is available at https://elmish.github.io/sample-react-navigation.

## Building and running the sample
Pre-requisites:
* .NET Core [SDK 5.*](https://docs.microsoft.com/en-us/dotnet/core/install/sdk)
* `yarn` installed as a global `npm` or a platform package and available in the path 

To build locally and start the webpack-devserver:
* once: `dotnet tool restore`
* `dotnet fake build -t Watch`

open [localhost:8090](http://localhost:8090)