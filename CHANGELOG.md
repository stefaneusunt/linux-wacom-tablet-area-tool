Changelog
=========

- 1.0.0 - Initial release
  - Features:
    - automatic device detection
    - abilty to modify area both visually and using actual device values
  - Known issues:
    - the device area size is not dynamically detected
    - sometimes the computation of the current setting fails
    - Osu sensitivity is present in UI, but no functionality is implemented
- 1.1.1 - Async update
  - Changes:
    - the underlying Wacom library was rewritten to be completely aynchronous,
removing any hiccups in performance and improving the device detection rate
    - added the ability to switch between multiple devices