import os
import glob


def deleteStateConfig(dir):
    currDir = os.getcwd();
    os.chdir(dir);
    subDirs = glob.glob("./*")
    for subDir in subDirs:
        if (subDir[2:len(subDir)] == 'stateConfig.conf'):
        	os.remove(subDir)

    os.chdir(currDir);

def main():
    os.chdir("./")
    deviceDirs = glob.glob("./*")
    for dir in deviceDirs:
        if (len(dir) == 34):
            # if "1D7AB3425337433231202020FF0D0000" in dir:
        	deleteStateConfig(dir)

if __name__ == "__main__":
    main()