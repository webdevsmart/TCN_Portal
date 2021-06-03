import ftplib
ftp = ftplib.FTP('ftp.viewvending.com', 'vending', 'Z9q9uVWuYD')
ftp.cwd("vgc2/01C357645337433231202020FF0D3505")

import os

def main():
	print ("File List:")
	files = ftp.dir()
	print (files)

	# print("*"*50, "LIST", "*"*50)
	# ftp.dir()

if __name__ == "__main__":
    main()