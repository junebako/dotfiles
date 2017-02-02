#!/bin/sh

DOTFILES=~/.dotfiles

cd ~/

ln -s $DOTFILES/.emacs.d
ln -s $DOTFILES/.gitconfig
ln -s $DOTFILES/.gitconfig.local
ln -s $DOTFILES/.gitignore_global
ln -s $DOTFILES/.screenrc
ln -s $DOTFILES/.tmux.conf
ln -s $DOTFILES/.tigrc
ln -s $DOTFILES/.zshrc
ln -s $DOTFILES/.zshenv
ln -s $DOTFILES/.zprofile
ln -s $DOTFILES/.zsh.d
ln -s $DOTFILES/.peco
ln -s $DOTFILES/.rspec
ln -s $DOTFILES/.gemrc

cd ~/Library/Application\ Support/Karabiner

ln -s $DOTFILES/karabiner/private.xml
