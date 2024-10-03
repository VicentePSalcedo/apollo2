#!/bin/sh

SESH="apollo2"

tmux has-session -t $SESH 2>/dev/null

if [ $? != 0 ]; then
    tmux new-session -d -s $SESH -n "editor"
    tmux send-keys -t $SESH:editor "cd app/" C-m
    tmux send-keys -t $SESH:editor "vi ." C-m

    tmux new-window -t $SESH -n "emulators"
    tmux send-keys -t $SESH:emulators "cd app/" C-m
    tmux send-keys -t $SESH:emulators "firebase emulators:start --import data/ --export-on-exit data/" C-m

    tmux select-window -t $SESH:editor
    tmux select-pane -U
fi

tmux attach-session -t $SESH
