#!/bin/bash
# ShunyaOS Context Sync Tool
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
TASK_DESCRIPTION=$1
OUTPUT_FILE="../CONTEXT_MEMORY.md"

echo -e "\n- [$TIMESTAMP] **Task:** $TASK_DESCRIPTION" >> $OUTPUT_FILE
echo "✅ Context Updated."
