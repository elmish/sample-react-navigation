#r "paket:
nuget Fake.IO.FileSystem
nuget Fake.DotNet.Cli
nuget Fake.JavaScript.Yarn
nuget Fake.Core.Target
nuget Fake.Tools.Git //"
#if !FAKE
#load ".fake/build.fsx/intellisense.fsx"
#r "Facades/netstandard"
#endif

open Fake.Core
open Fake.Core.TargetOperators
open Fake.DotNet
open Fake.Tools
open Fake.IO
open Fake.JavaScript


let gitName = "sample-react-navigation"
let gitOwner = "elmish"
let gitRepo = sprintf "git@github.com:%s/%s.git" gitOwner gitName

Target.create "Clean" (fun _ ->
    Shell.cleanDir "build"
)

Target.create "Install" (fun _ ->
    DotNet.restore id "src"
    Yarn.install id
)

Target.create "Build" (fun _ ->
    Yarn.exec "build" id
)

Target.create "Watch" (fun _ ->
    Yarn.exec "start" id
)

// --------------------------------------------------------------------------------------
// Release Scripts

Target.create "ReleaseSample" (fun _ ->
    let tempDocsDir = "temp/gh-pages"
    Shell.cleanDir tempDocsDir
    Git.Repository.cloneSingleBranch "" gitRepo  "gh-pages" tempDocsDir
    Git.Repository.fullclean tempDocsDir

    Shell.copyRecursive "build" tempDocsDir true |> Trace.tracefn "%A"
    Git.Staging.stageAll tempDocsDir
    Git.Commit.exec tempDocsDir "Update generated sample"
    Git.Branches.push tempDocsDir
)

Target.create "Publish" ignore

// Build order
"Clean"
  ==> "Install"
  ==> "Build"

"Clean"
  ==> "Install"
  ==> "Watch"

"Publish"
  <== [ "Build"
        "ReleaseSample" ]


// start build
Target.runOrDefault "Build"
