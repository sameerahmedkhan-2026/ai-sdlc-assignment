# Web Interface Contract: Smart Todo & Task Manager

The web interface consumes the REST contract in
[rest-api.md](./rest-api.md) and MUST not maintain a separate task store.

## Required views and interactions

- A task form MUST support title, description, tags, and priority fields for
  creation, with defaults matching the API. Creation MUST display status as a
  fixed `To Do` value rather than allowing a client-supplied initial status.
- Update controls MUST support the status field and the approved lifecycle
  transitions.
- A task list MUST display title, tags, priority, status, and available update
  and delete actions.
- The interface MUST provide a way to retrieve or view a task by ID.
- The interface MUST provide tag filtering and priority sorting.
- Update controls MUST distinguish full replacement behavior from partial
  edits, or use the corresponding API operation consistently.
- Delete controls MUST require a deliberate user action and refresh the list
  after successful deletion.

## Error and state behavior

- Validation errors returned by the API MUST identify the failed field or
  operation in visible text.
- A not-found response MUST identify that the requested task no longer exists.
- A status-transition conflict MUST explain that the requested transition is
  not allowed.
- Persistence or server errors MUST be shown as an error state and MUST NOT be
  presented as a successful save.
- Loading, empty-list, and no-filter-match states MUST be distinguishable.
