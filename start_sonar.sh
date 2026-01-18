#!/bin/bash
./sonarqube_server/bin/macosx-universal-64/sonar.sh start
tail -f ./sonarqube_server/logs/sonar.log
