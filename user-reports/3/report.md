A user has a custom work queue that they are using to schedule tasks between traces.
It appears that when using the timer instrumentation, it is conflating segments in
traces that are using the queue.

The user was able to reproduce the issue consistently - the adjacent `repro.js` file
contains an example, including their homegrown work queue in the `werkQ.js` file.
