A user reported that the tracer produced a trace with a segment that has a negative
exclusive time. The user has provided the serialized trace, but is unable to consistently
reproduce the issue.

```json
{
  "name": "user query",
  "trace": {
    "name": "test trace",
    "startTime": 1563222458153,
    "attributes": {},
    "totalDuration": 42,
    "exclusiveDuration": -2,
    "children": [
      {
        "name": "user query",
        "startTime": 1563222458153,
        "attributes": {},
        "totalDuration": 33,
        "exclusiveDuration": 11,
        "children": [
          {
            "name": "external",
            "startTime": 1563222458153,
            "attributes": {},
            "totalDuration": 5,
            "exclusiveDuration": 0,
            "children": [
              {
                "name": "timeout",
                "startTime": 1563222458153,
                "attributes": {},
                "totalDuration": 11,
                "exclusiveDuration": 11,
                "children": []
              },
              {
                "name": "query",
                "startTime": 1563222458169,
                "attributes": {},
                "totalDuration": 11,
                "exclusiveDuration": 11,
                "children": []
              }
            ]
          }
        ]
      }
    ]
  },
  "attributes": {}
}
```
