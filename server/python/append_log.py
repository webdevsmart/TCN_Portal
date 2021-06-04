import os
import glob


#Project root directory name:
ProjectDirName = "./"

#Append file name:
AppendedLogFileName = "Logs.txt"



#Given a device directory and target append file name,
#go inside the device directory and concat all small log files.
def AppendLogFiles(dir, appFileName):
    currDir = os.getcwd();
    os.chdir(dir);
    
    #LogFiles = os.listdir()
    LogFiles = glob.glob("*_log.txt")
    if (len(LogFiles) > 0):
        LogFiles.sort(reverse=False)
        
        #Open the appended log file.
        appLogFile = open(AppendedLogFileName, "a+")
        for file in LogFiles:
            with open(file) as logFile:
                #Parse the log file here before appending.
                lines = logFile.readlines()
                
                
                
                #Once parsing is done then append the lines.
                appLogFile.writelines(lines)
                logFile.close()
                os.remove(file)
        
        #Make sure to drop oldest line if file is too big.
        #appLogFile.seek(0)
        #lines = appLogFile.readlines()
        #if (len(lines) > 1000):
        #    appLogFile.seek(0)
        #    appLogFile.truncate()
        #    appLogFile.writelines(lines[-1000:]);
        
        appLogFile.close()
    os.chdir(currDir);

def main():
    # print("")
    os.chdir(ProjectDirName);
    deviceDirs = glob.glob("./*")
    
    #Only get the device directories which are expected to be unique IDs (32char long)
    for dir in deviceDirs:
        if (len(dir) == 34):
            # print (dir);
            AppendLogFiles(dir, AppendedLogFileName);
    


if __name__ == "__main__":
    main()