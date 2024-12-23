{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
  };

  outputs = { self, nixpkgs, ... }:
    let
      system = "x86_64-linux";
    in
    {
      devShells."${system}".default =
        let
          pkgs = import nixpkgs {
            inherit system;
          };
        in
        pkgs.mkShell {
          # create an environment with nodejs_18, pnpm, and yarn
          packages = with pkgs; [
            firebase-tools
            jdk
            nodejs_20
            nodePackages.pnpm
            nodePackages.typescript
            nodePackages."@angular/cli"
            vscode-extensions.angular.ng-template
            python3
          ];
          shellHook = ''
          '';
        };
    };
}
