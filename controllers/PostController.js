import Post from "../models/Post.js";

export const getAll = async (req, res) => {
    try {
        const posts = await Post.find({}).populate('user');
        res.json(posts);
    } catch (e) {
        console.log(e);
        res.status(500).json({message: 'Не удалось получить посты'});
    }
}

export const getOne = async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, {$inc: {viewsCount: 1}}, {returnDocument: 'after'}).populate('user');
        res.json(post);
    } catch (e) {
        console.log(e);
        res.status(500).json({message: 'Не удалось получить пост'});
    }
}

export const create = async (req, res) => {
    try {
        const doc = new Post({
            title: req.body.title,
            content: req.body.content,
            tags: req.body.tags,
            image: req.body.image,
            user: req.userId,
        });

        const post = await doc.save();
        res.json(post);
    } catch (e) {
        console.log(e);
        res.status(500).json({message: 'Не удалось создать пост'});
    }
};

export const update = async (req, res) => {
    try {
        await Post.updateOne({_id: req.params.id, user: req.userId}, {
            title: req.body.title,
            content: req.body.content,
            tags: req.body.tags,
            image: req.body.image,
            user: req.userId,
        })
        res.json({success: true, message: 'Пост обновлен'});
    } catch (e) {
        console.log(e);
        res.status(500).json({message: 'Не удалось обновить пост'});
    }
}

export const deletePost = async (req, res) => {
    try {
        await Post.deleteOne({_id: req.params.id, user: req.userId});
        res.json({success: true, message: 'Пост удален'});
    } catch (e) {
        console.log(e);
        res.status(500).json({message: 'Не удалось удалить пост'});
    }
}