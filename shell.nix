{
  pkgs ? import <nixpkgs> { },
}:

with pkgs;
let
  LD_LIBRARY_PATH = lib.makeLibraryPath [
    libGL
    libxkbcommon
    wayland
  ];
in
mkShell {
  shellHook = ''
    export LD_LIBRARY_PATH=${LD_LIBRARY_PATH};
    export LIBCLANG_PATH="${libclang.lib}/lib"
  '';

  nativeBuildInputs = [
    pkg-config
  ];

  buildInputs = [
    glib
    clang
    openssl
    libclang
  ];
}
