import prisma from '@/prisma';
import getUserCoordinates from '@/utils/getUserCoordinates';
import { changeImageSchema, removeImageSchema } from '@/validations/credential';
import {
  insertUserAddressSchema,
  updateGenderSchema,
  updatePhoneNumberSchema,
  updateUsernameSchema,
} from '@/validations/user';
import { Request, Response } from 'express';

export class UserController {
  async getCurrentUser(req: Request, res: Response) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: Number(req.currentUser?.id),
        },
        include: {
          addresses: {
            include: {
              city: {
                include: {
                  province: true,
                },
              },
            },
          },
          carts: true,
        },
      });

      if (!user) {
        return res.status(404).json({ ok: false, message: 'User not found' });
      }

      res.status(200).json({ ok: true, user });
    } catch {
      res.status(500).json({ ok: false, message: 'Something went wrong' });
    }
  }

  async insertUserAddress(req: Request, res: Response) {
    try {
      const validatedRequest = insertUserAddressSchema.safeParse(req.body);

      if (!validatedRequest.success) {
        return res.status(400).json({
          ok: false,
          message: validatedRequest.error.issues[0].message,
        });
      }

      const {
        label,
        address,
        city,
        province,
        province_id,
        city_id,
        is_primary,
        kecamatan,
        kelurahan,
      } = validatedRequest.data;

      if (is_primary) {
        await prisma.usersAddress.updateMany({
          where: {
            user_id: Number(req.currentUser?.id),
            is_primary: true,
          },
          data: {
            is_primary: false,
          },
        });
      }

      const userGeo = await getUserCoordinates({ city, province });
      if (!userGeo) {
        return res.status(400).json({ ok: false, message: 'Invalid address' });
      }

      const cityData = await prisma.city.findUnique({
        where: {
          id: city_id,
        },
      });

      if (!cityData) {
        return res.status(400).json({ ok: false, message: 'Invalid city' });
      }

      const newAddress = await prisma.usersAddress.create({
        data: {
          user_id: Number(req.currentUser?.id),
          label,
          address,
          city_id: cityData.id,
          is_primary,
          kecamatan,
          kelurahan,
          postal_code: cityData.postal_code,
          latitude: userGeo.latitude,
          longtitude: userGeo.longtitude,
        },
      });

      res
        .status(200)
        .json({ ok: true, message: 'Add address success', data: newAddress });
    } catch {
      res.status(500).json({ ok: false, message: 'Something went wrong' });
    }
  }

  async deleteUserAddress(req: Request, res: Response) {
    try {
      const { address_id } = req.params;
      if (!address_id) {
        return res
          .status(400)
          .json({ ok: false, message: 'Address id is required' });
      }

      const userAddresses = await prisma.usersAddress.findMany({
        where: {
          user_id: Number(req.currentUser?.id),
        },
      });

      if (userAddresses.length <= 1) {
        return res
          .status(400)
          .json({ ok: false, message: 'You must have at least one address' });
      }

      // Find the address to delete and check if it is the primary address
      const addressToDelete = await prisma.usersAddress.findUnique({
        where: {
          id: Number(address_id),
        },
      });

      const isPrimary = addressToDelete?.is_primary;

      const deletedAddress = await prisma.usersAddress.delete({
        where: {
          id: Number(address_id),
        },
      });

      // If the deleted address was the primary and only one address remains,
      // make that remaining address the new primary address
      if (isPrimary && userAddresses.length === 2) {
        const remainingAddress = userAddresses.find(
          (address) => address.id !== Number(address_id),
        );

        if (remainingAddress) {
          await prisma.usersAddress.update({
            where: {
              id: remainingAddress.id,
            },
            data: {
              is_primary: true,
            },
          });
        }
      }

      res.status(200).json({
        ok: true,
        message: 'Delete address success',
        data: deletedAddress,
      });
    } catch (error) {
      res.status(500).json({ ok: false, message: 'Something went wrong' });
    }
  }

  async useAddressAsPrimary(req: Request, res: Response) {
    try {
      const { address_id } = req.params;
      if (!address_id) {
        return res
          .status(400)
          .json({ ok: false, message: 'Address id is required' });
      }

      await prisma.usersAddress.updateMany({
        where: {
          user_id: Number(req.currentUser?.id),
          is_primary: true,
        },
        data: {
          is_primary: false,
        },
      });

      await prisma.usersAddress.update({
        where: {
          id: Number(address_id),
        },
        data: {
          is_primary: true,
        },
      });

      res
        .status(200)
        .json({ ok: true, message: 'Use address as primary success' });
    } catch {
      res.status(500).json({ ok: false, message: 'Something went wrong' });
    }
  }

  async updateUserBiodata(req: Request, res: Response) {
    try {
      const { field } = req.query;

      if (!field) {
        return res
          .status(400)
          .json({ ok: false, message: 'Field is required' });
      }

      if (field === 'username') {
        const validatedRequest = updateUsernameSchema.safeParse(req.body);

        if (!validatedRequest.success) {
          return res.status(400).json({
            ok: false,
            message: validatedRequest.error.issues[0].message,
          });
        }

        const { username } = validatedRequest.data;

        const user = await prisma.user.update({
          where: {
            id: Number(req.currentUser?.id),
          },
          data: {
            username,
          },
        });

        return res
          .status(200)
          .json({ ok: true, message: 'Update user success', data: user });
      } else if (field === 'gender') {
        const validatedRequest = updateGenderSchema.safeParse(req.body);

        if (!validatedRequest.success) {
          return res.status(400).json({
            ok: false,
            message: validatedRequest.error.issues[0].message,
          });
        }

        const { gender } = validatedRequest.data;

        const user = await prisma.user.update({
          where: {
            id: Number(req.currentUser?.id),
          },
          data: {
            gender: gender as 'male' | 'female',
          },
        });

        res
          .status(200)
          .json({ ok: true, message: 'Update user success', data: user });
      } else if (field === 'phone_number') {
        const validatedRequest = updatePhoneNumberSchema.safeParse(req.body);
        if (!validatedRequest.success) {
          return res.status(400).json({
            ok: false,
            message: validatedRequest.error.issues[0].message,
          });
        }

        const { phone_number } = validatedRequest.data;

        const user = await prisma.user.update({
          where: {
            id: Number(req.currentUser?.id),
          },
          data: {
            phone_number,
          },
        });

        res
          .status(200)
          .json({ ok: true, message: 'Update user success', data: user });
      } else if (field === 'image') {
        const validatedRequest = changeImageSchema.safeParse(req.body);
        if (!validatedRequest.success) {
          return res.status(400).json({
            ok: false,
            message: validatedRequest.error.issues[0].message,
          });
        }

        const { image } = validatedRequest.data;
        const user = await prisma.user.update({
          where: {
            id: Number(req.currentUser?.id),
          },
          data: {
            image,
          },
        });

        res
          .status(200)
          .json({ ok: true, message: 'Update image success', data: user });
      } else if (field === 'remove_image') {
        const validatedRequest = removeImageSchema.safeParse(req.body);
        if (!validatedRequest.success) {
          return res.status(400).json({
            ok: false,
            message: validatedRequest.error.issues[0].message,
          });
        }

        const user = await prisma.user.update({
          where: {
            id: Number(req.currentUser?.id),
          },
          data: {
            image: null,
          },
        });

        res
          .status(200)
          .json({ ok: true, message: 'Success remove image', data: user });
      } else {
        return res.status(400).json({ ok: false, message: 'Field not found' });
      }
    } catch {
      res.status(500).json({ ok: false, message: 'Something went wrong' });
    }
  }
}
