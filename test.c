#include <stdio.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>
#include <string.h>

#define LINESIZE 16

//use one command line argument
int main(int argc, char *argv[]) {
	if (argc < 2) {
		printf("Usage: diagonal <textstring>\n");
		return -1;
	}


  int numWords = argc-1;

	//create a file so that 16 rows of empty will appear with od -c command
	int fd = open("diagonal2.out", O_CREAT | O_WRONLY | O_TRUNC, S_IRUSR | S_IWUSR);
	char space = ' ';

  for (int i = 0; i < numWords; i++) {
    for (int line = 0 + (i * LINESIZE); line < LINESIZE + (i * LINESIZE); line++)
      for (int column = 0; column < LINESIZE; column++) {
          write(fd, &space, 1);
      }
  } 

  int leftAlign = 1;
  int totalLength = 0;
  int startingOffset = 0;


    //Each line of od outputs 16 characters
	//So, to make the output diagonal, we will use 0, 17, 34, ..

  for (int wordIndex = 1; wordIndex <= numWords; wordIndex++) {
    int n = strlen(argv[wordIndex]);

    if (wordIndex % 2 == 0) {
      leftAlign = 0;
    } else {
      leftAlign = 1;
    }


    if (leftAlign) {
      startingOffset = (LINESIZE * LINESIZE) * (wordIndex-1);
    } else {
      startingOffset = (LINESIZE * LINESIZE) * (wordIndex-1) - 2;
    }

    printf("startingOffset: %d\n", startingOffset);
    lseek(fd, startingOffset, SEEK_SET);

  	for(int i=0; i<n; i++) {
  		write(fd, &argv[wordIndex][i], 1);

      int offset = 0;

      if (leftAlign) {
        offset = 16;
      } else {
        offset = LINESIZE - 2;
      }

      lseek(fd, offset, SEEK_CUR);
      // lseek(fd, (LINESIZE * wordIndex) + LINESIZE, SEEK_CUR);
  	}

    totalLength += LINESIZE;
  }

	close(fd);
	puts("diagonal2.out has been created. Use od -c diagonal2.out to see the contents.");
}
