#!/bin/sh

DOTFILES=~/.dotfiles

cd ~/

ln -s $DOTFILES/.emacs.d
ln -s $DOTFILES/.screenrc
ln -s $DOTFILES/.tigrc
ln -s $DOTFILES/.zshrc
ln -s $DOTFILES/.zshenv
ln -s $DOTFILES/.zprofile
