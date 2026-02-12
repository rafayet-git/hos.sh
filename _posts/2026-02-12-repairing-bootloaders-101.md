---
layout: post
title: Repairing Bootloaders 101
date: 2026-02-11
tags: ''
---

This is just a short note for myself as I am currently in my distro-hopping stage. I've been testing various bootloaders, as the game has changed over the years w/ more options that aren't just GRUB, such as rEFInd and Limine. 

```
[liveuser@CachyOS ~]$ lsblk
NAME        MAJ:MIN RM  SIZE RO TYPE MOUNTPOINTS
loop0         7:0    0  2.7G  1 loop /run/archiso/airootfs
sda           8:0    1 57.8G  0 disk
├─sda1        8:1    1 57.7G  0 part
│ ├─ventoy  253:0    0  2.9G  1 dm
│ └─sda1    253:1    0 57.7G  0 dm
└─sda2        8:2    1   32M  0 part
zram0       252:0    0 30.9G  0 disk [SWAP]
nvme0n1     259:0    0  1.9T  0 disk
├─nvme0n1p1 259:1    0  4.1G  0 part
└─nvme0n1p2 259:2    0  1.9T  0 part
[liveuser@CachyOS ~]$ sudo cryptsetup luksOpen /dev/nvme0n1p2 cryptid
Enter passphrase for /dev/nvme0n1p2:
[liveuser@CachyOS ~]$ sudo mount /dev/mapper/cryptid /mnt -o subvol=@
[liveuser@CachyOS ~]$ sudo mount /dev/nvme0n1p1 /mnt/
.snapshots/ dev/        lib/        opt/        run/        sys/        var/
bin/        etc/        lib64/      proc/       sbin/       tmp/
boot/       home/       mnt/        root/       srv/        usr/
[liveuser@CachyOS ~]$ sudo mount /dev/nvme0n1p1 /mnt/boot/efi/
```
