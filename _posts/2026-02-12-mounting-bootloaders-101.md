---
layout: post
title: Mounting Bootloaders 101
date: 2026-02-12
tags: linux
---

This is just a short note for myself as I am currently in my distro-hopping stage. I've been testing various bootloaders, as the game has changed over the years w/ more options that aren't just GRUB, such as rEFInd and Limine.

Simplest way to do this is to load a live CD with a distro of your choice (I am using an arch-based distro here).

On terminal identify drives using `lsblk`. All my data is in the nvme0n1 drive, with the large 2tb partition on nvme0n1p2 and the 4 gig partition on nvme0n1p1. You can tell because it's the biggest one here.

```bash
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
```

I need to mount nvme0n1p2 as `/mnt` and then mount nvme0n1p1 inside it, as `/mnt/boot` ( sometimes it might be `/mnt/boot/efi` or `/mnt/efi` depending on how the distro installs it, but it's rare and sometimes not very important).

If i was using a normal formatted drive (such as ext4) it would go like this:

```bash
[liveuser@CachyOS ~]$ sudo mount /dev/nvme0n1p2 /mnt
[liveuser@CachyOS ~]$ sudo mount /dev/nvme0n1p1 /mnt/boot
```

However, mine is formatted using btrfs and is LUKS-encrypted, so there's a few more steps before I can mount nvme0n1p2.

First I need to decrypt the drive:

```bash
[liveuser@CachyOS ~]$ sudo cryptsetup luksOpen /dev/nvme0n1p2 cryptid
Enter passphrase for /dev/nvme0n1p2:
```

This then places a decrpyted version of the volume inside `/dev/mapper/cryptid`, in place of the nvme0n1p2. However I can't mount this directly as btrfs stores data inside subvolumes. All you really need to know is that the subvolume "@" contains the whole drive. So we mount that:

```bash
[liveuser@CachyOS ~]$ sudo mount /dev/mapper/cryptid /mnt -o subvol=@
[liveuser@CachyOS ~]$ sudo mount /dev/nvme0n1p1 /mnt/boot
```

And there we go! You can now run the drive using `arch-chroot` or something similar, and run the magic commands as needed.
