# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.1] - 2021-04-07

### Added

- Log every request for easier debugging

## [1.0.0] - 2021-03-17

- Move to version 1.0.0
- Added graceful shutdown to play nicely with Kubernetes and other container managers
- Added automatic `/healthz` endpoint

## [0.2.3] - 2021-02-10

- Increase the limit of all requests to 50MB.

## [0.2.2] - 2020-08-25

### Fixed

- Fixed bug where the "index" route would not be the last route and would overwrite other routes

## [0.2.1] - 2020-08-11

### Changed

- Improved typing to make Context interface exensible

## [0.2.0] - 2020-07-30

### Added

- New custom method "do"

## [0.1.5] - 2020-07-30

### Changed

- Improved CLI tooling

## [0.1.0] - 2020-07-20

### Changed

- Better support for modules in ES6 with Typescript and CommonJS with Node

## [0.0.1] - 2020-07-17

- Launched first version of Bantam
