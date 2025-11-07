#!/bin/bash
cd /home/kavia/workspace/code-generation/user-management-system-184144-184153/user_management_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

