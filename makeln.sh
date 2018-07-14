#!/bin/sh

DOTFILES=~/.dotfiles

cd ~/

ln -s $DOTFILES/.docker
ln -s $DOTFILES/.emacs.d
ln -s $DOTFILES/.gemrc
ln -s $DOTFILES/.gitconfig
ln -s $DOTFILES/.gitconfig.local
ln -s $DOTFILES/.gitignore_global
ln -s $DOTFILES/.peco
ln -s $DOTFILES/.rspec
ln -s $DOTFILES/.screenrc
ln -s $DOTFILES/.tigrc
ln -s $DOTFILES/.tmux.conf
ln -s $DOTFILES/.zprofile
ln -s $DOTFILES/.zsh.d
ln -s $DOTFILES/.zshenv
ln -s $DOTFILES/.zshrc

cd ~/.config

ln -s $DOTFILES/.config/karabiner
