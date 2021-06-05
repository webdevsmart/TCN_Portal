import os
import ftplib
ftp = ftplib.FTP('ftp.viewvending.com', 'vending', 'Z9q9uVWuYD')
ftp.cwd("vgc2")

import os

def main():
	files = []

	try:
		files = ftp.nlst()
	except ftplib.error_perm, resp:
		if str(resp) == "550 No files found":
			print "No files in this directory"
		else:
			raise

	for f in files:
		print f

	# print("*"*50, "LIST", "*"*50)
	# ftp.dir()

if __name__ == "__main__":
    main()
