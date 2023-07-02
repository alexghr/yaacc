{
  description = "Yet Another Auto Complete Component";
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    corepack = {
      url = "github:alexghr/corepack.nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    flake-utils.url ="github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, corepack, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
          overlays = [
            corepack.overlays.default
          ];
        };
      in {
        devShells.default = pkgs.mkShell {
          nativeBuildInputs = [ pkgs.bashInteractive ];
          buildInputs = [
            pkgs.nodejs-18_x
            pkgs.corepack
          ];
        };
      }
    );
}
