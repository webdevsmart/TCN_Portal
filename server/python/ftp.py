import ftplib
ftp = ftplib.FTP('ftp.viewvending.com', 'vending', 'Z9q9uVWuYD')
ftp.cwd("vgc2")

import os

def main():
	files = ftp.dir()
	for dir in files:
		if (len(dir) == 34):
			print(dir)

	# print("*"*50, "LIST", "*"*50)
	# ftp.dir()

if __name__ == "__main__":
    main()