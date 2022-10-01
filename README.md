NAWA: A WAMP-Protocol Server for NodeJS
==================================================

_**N**eo**A**tlantis **WA**mp Protocol Server_ or NAWA, is a server
implementation for the Web Application Messaging Protocol (WAMP).

Basic profile will be implemented, and the author try to do a plugin system
for flexible extension with advanced profiles.

`nawa` consists multiple parts where the user may choose to use:

1. `nawa-abstract`, a transport-independent implementation and also core of
this project. It is more a state machine that processes protocol packets. In
this way, the users may implement their own secured transports.

2. `nawa-ws`, a websocket based server.
